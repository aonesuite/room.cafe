package httputil

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"
	"syscall"

	"components/log"
)

// HandleFunc return handle func width http status code and response data
func HandleFunc(code int, data interface{}) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		Reply(w, code, data)
	}
}

// HandleFuncWithCode return handle func width http status code
func HandleFuncWithCode(code int) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ReplyWithCode(w, code)
	}
}

// ---------------------------------------------------------------------------
// func Reply

// Reply write http status code and data to http response writer
func Reply(w http.ResponseWriter, code int, data interface{}) {

	msg, err := json.Marshal(data)
	if err != nil {
		Error(w, err)
		return
	}

	h := w.Header()
	h.Set("Content-Length", strconv.Itoa(len(msg)))
	h.Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(msg)
}

// ReplyWith write http status code and data to http response writer with request body type
func ReplyWith(w http.ResponseWriter, code int, bodyType string, msg []byte) {

	h := w.Header()
	h.Set("Content-Length", strconv.Itoa(len(msg)))
	h.Set("Content-Type", bodyType)
	w.WriteHeader(code)
	w.Write(msg)
}

// ReplyWithStream write http status code and data to http response writer with request body type
func ReplyWithStream(w http.ResponseWriter, code int, bodyType string, body io.Reader, bytes int64) {

	h := w.Header()
	h.Set("Content-Length", strconv.FormatInt(bytes, 10))
	h.Set("Content-Type", bodyType)
	w.WriteHeader(code)
	io.Copy(w, body) // don't use io.CopyN: if you need, call io.LimitReader(body, bytes) by yourself
}

// ReplyWithCode write http status code and data to http response writer
func ReplyWithCode(w http.ResponseWriter, code int) {

	if code < 400 {
		h := w.Header()
		h.Set("Content-Length", "2")
		h.Set("Content-Type", "application/json")
		w.WriteHeader(code)
		w.Write(emptyObj)
	} else {
		err := http.StatusText(code)
		if err == "" {
			err = "E" + strconv.Itoa(code)
		}
		ReplyErr(w, code, err)
	}
}

var emptyObj = []byte{'{', '}'}

// ---------------------------------------------------------------------------
// func Error

// HTTPCodeOf func
var HTTPCodeOf = func(err error) int {
	return 599
}

// Error write error to http response writer
func Error(w http.ResponseWriter, err error) {

	code, errStr := DetectError(err)
	replyErr(2, w, code, errStr, err.Error())
}

// ReplyErr write error to http response writer with http status code
func ReplyErr(w http.ResponseWriter, code int, err string) {

	replyErr(2, w, code, err, err)
}

type httpCoder interface {
	HttpCode() int
}

// DetectCode detect error return http status code
func DetectCode(err error) int {

	if e, ok := err.(*ErrorInfo); ok {
		return e.Code
	} else if e, ok := err.(httpCoder); ok {
		return e.HttpCode()
	}
	switch err {
	case syscall.EINVAL:
		return 400
	case syscall.ENOENT:
		return 612 // no such entry
	case syscall.EEXIST:
		return 614 // entry exists
	}
	return HTTPCodeOf(err)
}

type rpcError interface {
	Error() string
	HttpCode() int
}

// DetectError detect error return http status code and desc
func DetectError(err error) (code int, desc string) {

	if e, ok := err.(*ErrorInfo); ok {
		return e.Code, e.Err
	} else if e, ok := err.(rpcError); ok {
		return e.HttpCode(), e.Error()
	}
	switch err {
	case syscall.EINVAL:
		return 400, "invalid arguments"
	case syscall.ENOENT:
		return 612, "no such entry"
	case syscall.EEXIST:
		return 614, "entry exists"
	case context.Canceled:
		return 499, context.Canceled.Error()
	}
	return HTTPCodeOf(err), err.Error()
}

type errorRet struct {
	Error string `json:"error"`
}

func replyErr(lvl int, w http.ResponseWriter, code int, err, detail string) {

	logWithReqid(w.Header().Get("X-Reqid"), detail)

	msg, _ := json.Marshal(errorRet{err})

	h := w.Header()
	h.Set("Content-Length", strconv.Itoa(len(msg)))
	h.Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(msg)
}

func logWithReqid(reqid string, str string) {
	str = strings.Replace(str, "\n", "\n["+reqid+"]", -1)
	log.Warn(str)
}

// ---------------------------------------------------------------------------
// type ErrorInfo

// ErrorInfo error info type
type ErrorInfo struct {
	Err  string
	Code int
}

// NewError return error info obj
func NewError(code int, err string) *ErrorInfo {
	return &ErrorInfo{err, code}
}

// Error implement error interface method
func (e *ErrorInfo) Error() string {
	return e.Err
}
