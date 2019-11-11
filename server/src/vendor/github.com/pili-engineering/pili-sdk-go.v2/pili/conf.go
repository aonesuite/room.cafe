package pili

import (
	"fmt"
	"runtime"
)

// APIHost 指定了 API 服务器的地址
var APIHost = "pili.qiniuapi.com"

// APIUserAgent 指定了在请求 API 服务器时填充的 UserAgent Header.
var APIUserAgent = fmt.Sprintf("pili-sdk-go/v2 %s %s/%s", runtime.Version(), runtime.GOOS, runtime.GOARCH)

// APIHTTPScheme 指定了在请求 API 服务器时使用的 HTTP 模式.
var APIHTTPScheme = "http://"
