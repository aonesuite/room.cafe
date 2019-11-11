package testhelper

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"strconv"
)

// PerformRequest router test
func PerformRequest(r http.Handler, method, path string, header http.Header, body ...io.Reader) *httptest.ResponseRecorder {
	var data io.Reader

	if len(body) > 0 {
		data = body[0]
	}

	req, _ := http.NewRequest(method, path, data)
	req.Header = header
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

// PerformRequestJSON router test
func PerformRequestJSON(r http.Handler, method, path string, body io.Reader, header ...http.Header) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, body)

	h := http.Header{}
	if len(header) > 0 {
		h = header[0]
	}

	h.Set("Content-Type", "application/json")
	req.Header = h

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

// PerformRequestJSONV2 使用interface{} 作为json参数，在函数内部去json Marshal
func PerformRequestJSONV2(r http.Handler, method, path string, data interface{}, header ...http.Header) *httptest.ResponseRecorder {
	b, _ := json.Marshal(data)
	req, _ := http.NewRequest(method, path, bytes.NewReader(b))

	h := http.Header{}
	if len(header) > 0 {
		h = header[0]
	}

	h.Set("Content-Type", "application/json")
	req.Header = h

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

// StructToMap return url Values for struct or map
func StructToMap(i interface{}) (values url.Values) {
	values = url.Values{}
	iVal := reflect.ValueOf(i).Elem()
	typ := iVal.Type()
	for i := 0; i < iVal.NumField(); i++ {
		f := iVal.Field(i)
		// You ca use tags here...
		// tag := typ.Field(i).Tag.Get("tagname")
		// Convert each type into a string for the url.Values string map
		var v string
		switch f.Interface().(type) {
		case int, int8, int16, int32, int64:
			v = strconv.FormatInt(f.Int(), 10)
		case uint, uint8, uint16, uint32, uint64:
			v = strconv.FormatUint(f.Uint(), 10)
		case float32:
			v = strconv.FormatFloat(f.Float(), 'f', 4, 32)
		case float64:
			v = strconv.FormatFloat(f.Float(), 'f', 4, 64)
		case []byte:
			v = string(f.Bytes())
		case string:
			v = f.String()
		}
		values.Set(typ.Field(i).Name, v)
	}
	return
}
