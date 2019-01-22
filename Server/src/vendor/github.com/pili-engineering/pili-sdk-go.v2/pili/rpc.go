package pili

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
)

type rpc struct {
	http.Client
}

func newRPC(tr http.RoundTripper) *rpc {
	return &rpc{Client: http.Client{
		Transport: tr,
	}}
}

func (r *rpc) do(method, url, bodyType string, body io.Reader, bodyLength int) (resp *http.Response, err error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return
	}
	req.Header.Set("Content-Type", bodyType)
	req.Header.Set("User-Agent", APIUserAgent)
	req.ContentLength = int64(bodyLength)
	return r.Do(req)
}

func (r *rpc) Call(ret interface{}, method, url string) error {
	resp, err := r.do(method, url, "application/x-www-form-urlencoded", nil, 0)
	if err != nil {
		return err
	}
	return callRet(ret, resp)
}

func (r *rpc) CallWithJSON(ret interface{}, method, url string, param interface{}) error {
	msg, err := json.Marshal(param)
	if err != nil {
		return err
	}
	resp, err := r.do(method, url, "application/json", bytes.NewReader(msg), len(msg))
	if err != nil {
		return err
	}
	return callRet(ret, resp)
}

// --------------------------------------------------------------------

// Error 错误信息.
type Error struct {
	Err   string `json:"error,omitempty"` // 错误信息.
	Code  int    `json:"code,omitempty"`  // HTTP 状态码, 0 意味着请求没有到达服务端.
	Reqid string `json:"reqid,omitempty"` // 请求标识, 一般是唯一的.
	Key   string `json:"key,omitempty"`   // 服务端内部关键字.
	Errno int    `json:"errno,omitempty"` // 服务端内部错误码.
}

// Error 返回错误信息.
func (e *Error) Error() string {
	if e.Err == "" {
		return fmt.Sprintf("code(%d)", e.Code)
	}
	return e.Err
}

// DetectErrorCode 探测rpc error对应的错误码, 如果e为nil或者非rpc error返回-1.
func DetectErrorCode(e error) int {
	if e != nil {
		if ee, ok := e.(*Error); ok {
			return ee.Code
		}
	}
	return -1
}

// --------------------------------------------------------------------

func parseError(e *Error, r io.Reader) {
	b, err := ioutil.ReadAll(io.LimitReader(r, 4096))
	if err != nil {
		e.Err = err.Error()
		return
	}
	var ret struct {
		Err   string `json:"error"`
		Key   string `json:"key"`
		Errno int    `json:"errno"`
	}
	if err := json.Unmarshal(b, &ret); err == nil && ret.Err != "" {
		e.Err, e.Key, e.Errno = ret.Err, ret.Key, ret.Errno
		return
	}
	e.Err = string(b)
}

func responseError(resp *http.Response) error {
	e := &Error{
		Reqid: resp.Header.Get("X-Reqid"),
		Code:  resp.StatusCode,
	}
	if resp.StatusCode > 299 {
		if resp.ContentLength != 0 {
			ct := resp.Header.Get("Content-Type")
			if strings.HasPrefix(ct, "application/json") {
				parseError(e, resp.Body)
			}
		}
	}
	return e
}

func callRet(ret interface{}, resp *http.Response) error {
	defer func() {
		io.Copy(ioutil.Discard, io.LimitReader(resp.Body, 4096))
		resp.Body.Close()
	}()

	if resp.StatusCode/100 == 2 {
		if ret != nil && resp.ContentLength != 0 {
			err := json.NewDecoder(resp.Body).Decode(ret)
			if err != nil {
				return err
			}
		}
		if resp.StatusCode == 200 {
			return nil
		}
	}
	return responseError(resp)
}
