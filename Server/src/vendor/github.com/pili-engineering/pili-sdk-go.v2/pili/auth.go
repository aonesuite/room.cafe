package pili

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"io"
	"net/http"

	"qiniupkg.com/x/bytes.v7/seekable"
)

type MAC struct {
	AccessKey string
	SecretKey []byte
}

func (m *MAC) Sign(data []byte) string {
	h := hmac.New(sha1.New, m.SecretKey)
	h.Write(data)
	sign := base64.URLEncoding.EncodeToString(h.Sum(nil))
	return m.AccessKey + ":" + sign
}

// ---------------------------------------------------------------------------------------

const maxContentLength = 1024 * 1024

func incBody(req *http.Request, ctType string) bool {
	typeOk := ctType != "" && ctType != "application/octet-stream"
	lengthOk := req.ContentLength > 0 && req.ContentLength < maxContentLength
	return typeOk && lengthOk && req.Body != nil
}

func (m *MAC) SignRequest(req *http.Request) (token string, err error) {
	h := hmac.New(sha1.New, m.SecretKey)

	u := req.URL
	data := req.Method + " " + u.Path
	if u.RawQuery != "" {
		data += "?" + u.RawQuery
	}
	io.WriteString(h, data+"\nHost: "+req.Host)

	ctType := req.Header.Get("Content-Type")
	if ctType != "" {
		io.WriteString(h, "\nContent-Type: "+ctType)
	}

	io.WriteString(h, "\n\n")

	if incBody(req, ctType) {
		s2, err2 := seekable.New(req)
		if err2 != nil {
			return "", err2
		}
		h.Write(s2.Bytes())
	}

	sign := base64.URLEncoding.EncodeToString(h.Sum(nil))
	return m.AccessKey + ":" + sign, nil
}

// ---------------------------------------------------------------------------------------

type transport struct {
	http.RoundTripper
	mac *MAC
}

func newTransport(mac *MAC, tr http.RoundTripper) *transport {
	if tr == nil {
		tr = http.DefaultTransport
	}
	return &transport{tr, mac}
}

func (t *transport) RoundTrip(req *http.Request) (resp *http.Response, err error) {
	token, err := t.mac.SignRequest(req)
	if err != nil {
		return
	}
	req.Header.Set("Authorization", "Qiniu "+token)
	return t.RoundTripper.RoundTrip(req)
}
