package rpc

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"

	"components/utils/httputil"
)

var userAgentTst string

func foo(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	httputil.Reply(w, 200, map[string]interface{}{
		"info":  "Call method foo",
		"url":   req.RequestURI,
		"query": req.Form,
	})
}

func agent(w http.ResponseWriter, req *http.Request) {

	userAgentTst = req.Header.Get("User-Agent")
}

type Object struct {
}

func (p *Object) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	req2, _ := ioutil.ReadAll(req.Body)
	httputil.Reply(w, 200, map[string]interface{}{"info": "Call method object", "req": string(req2)})
}

var done = make(chan bool)

func server(t *testing.T) *httptest.Server {
	mux := http.NewServeMux()
	mux.HandleFunc("/foo", foo)
	mux.Handle("object", new(Object))
	return httptest.NewServer(mux)
}

func TestCall(t *testing.T) {
	s := server(t)
	defer s.Close()

	//param := "http:**localhost:8888*abc:def,g;+&$=foo*~!*~!"
	r := map[string]interface{}{}
	c := DefaultClient
	c.GetCall(nil, &r, s.URL+"/foo")
	assert.Equal(t, r, map[string]interface{}{"info": "Call method foo", "query": map[string]interface{}{}, "url": "/foo"})

	c.GetCallWithForm(nil, &r, s.URL+"/foo", map[string][]string{"a": {"1"}})
	assert.Equal(t, r["url"], "/foo?a=1")

	c.GetCallWithForm(nil, &r, s.URL+"/foo?b=2", map[string][]string{"a": {"1"}})
	assert.Equal(t, r["url"], "/foo?b=2&a=1")

	c.GetCallWithForm(nil, &r, s.URL+"/foo?", map[string][]string{"a": {"1"}})
	assert.Equal(t, r["url"], "/foo?&a=1")
}

func TestDo(t *testing.T) {

	svr := httptest.NewServer(http.HandlerFunc(agent))
	defer svr.Close()

	svrUrl := svr.URL
	c := DefaultClient
	{
		req, _ := http.NewRequest("GET", svrUrl+"/agent", nil)
		c.Do(nil, req)
		assert.Equal(t, userAgentTst, "Golang rpc package")
	}
	{
		req, _ := http.NewRequest("GET", svrUrl+"/agent", nil)
		req.Header.Set("User-Agent", "tst")
		c.Do(nil, req)
		assert.Equal(t, userAgentTst, "tst")
	}
}

func TestResponseError(t *testing.T) {

	fmtStr := "{\"error\":\"test error info\"}"
	http.HandleFunc("/ct1", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(599)
		w.Write([]byte(fmt.Sprintf(fmtStr)))
	}))
	http.HandleFunc("/ct2", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(599)
		w.Write([]byte(fmt.Sprintf(fmtStr)))
	}))
	http.HandleFunc("/ct3", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", " application/json ; charset=utf-8")
		w.WriteHeader(599)
		w.Write([]byte(fmt.Sprintf(fmtStr)))
	}))
	ts := httptest.NewServer(nil)
	defer ts.Close()

	resp, _ := http.Get(ts.URL + "/ct1")
	assert.Equal(t, "test error info", ResponseError(resp).Error())
	resp, _ = http.Get(ts.URL + "/ct2")
	assert.Equal(t, "test error info", ResponseError(resp).Error())
	resp, _ = http.Get(ts.URL + "/ct3")
	assert.Equal(t, "test error info", ResponseError(resp).Error())
}
