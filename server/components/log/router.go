package log

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"time"

	"github.com/gin-gonic/gin"
)

type bufferedWriter struct {
	gin.ResponseWriter
	out    *bufio.Writer
	Buffer bytes.Buffer
}

func (g *bufferedWriter) Write(data []byte) (int, error) {
	g.Buffer.Write(data)
	return g.out.Write(data)
}

var (
	green   = string([]byte{27, 91, 57, 55, 59, 52, 50, 109})
	white   = string([]byte{27, 91, 57, 48, 59, 52, 55, 109})
	yellow  = string([]byte{27, 91, 57, 55, 59, 52, 51, 109})
	red     = string([]byte{27, 91, 57, 55, 59, 52, 49, 109})
	blue    = string([]byte{27, 91, 57, 55, 59, 52, 52, 109})
	magenta = string([]byte{27, 91, 57, 55, 59, 52, 53, 109})
	cyan    = string([]byte{27, 91, 57, 55, 59, 52, 54, 109})
	reset   = string([]byte{27, 91, 48, 109})
)

var routerLogger = New()

// ErrorLogger error logger
func ErrorLogger() gin.HandlerFunc {
	return ErrorLoggerT(gin.ErrorTypeAny)
}

// ErrorLoggerT error logger t
func ErrorLoggerT(typ gin.ErrorType) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		errors := c.Errors.ByType(typ)
		if len(errors) > 0 {
			c.JSON(-1, errors)
		}
	}
}

// RouterLoggerCall type
type RouterLoggerCall struct {
	Hooks     []Hook
	Notlogged []string
	Guest     func(c *gin.Context) string
}

// RouterLogger instances a Logger middleware that will write the logs to gin.DefaultWriter
// By default gin.DefaultWriter = os.Stdout
func RouterLogger(call *RouterLoggerCall) gin.HandlerFunc {
	if call != nil {
		for _, hook := range call.Hooks {
			routerLogger.AddHook(hook)
		}
	}
	return WithWriter(gin.DefaultWriter, call)
}

// WithWriter instance a Logger middleware with the specified writter buffer.
// Example: os.Stdout, a file opened in write mode, a socket...
func WithWriter(out io.Writer, call *RouterLoggerCall) gin.HandlerFunc {
	var skip map[string]struct{}

	if call != nil {
		if length := len(call.Notlogged); length > 0 {
			skip = make(map[string]struct{}, length)
			for _, path := range call.Notlogged {
				skip[path] = struct{}{}
			}
		}
	}

	return func(c *gin.Context) {
		start := time.Now()

		guest := "NOSESSION"
		if call != nil && call.Guest != nil {
			guest = call.Guest(c)
		}

		xReqid := c.Request.Header.Get("X-Reqid")
		if xReqid == "" {
			xReqid = GenReqID()
		}
		c.Header("X-Reqid", xReqid)

		path := c.Request.URL.Path

		// Log only when path is not being skipped
		if _, ok := skip[path]; !ok {
			fmt.Fprintf(out, "\n[%s] \033[33m[%v]\033[0m\t[ROUTER] [Started] [%s] %s %s %s %s | %s\n",
				xReqid,
				start.Format(defaultTimestampFormat),
				guest,
				c.ClientIP(),
				colorForMethod(c.Request.Method),
				c.Request.Method,
				reset,
				c.Request.URL.String(),
			)
		}

		// Process request
		c.Next()

		if _, ok := skip[path]; !ok && c.Writer.Status() >= 400 {
			w := bufio.NewWriter(c.Writer)
			buff := bytes.Buffer{}
			newWriter := &bufferedWriter{c.Writer, w, buff}
			c.Writer = newWriter

			defer func() {
				response := newWriter.Buffer.Bytes()
				if len(response) > 0 {
					fmt.Fprintf(out, "[%s] \033[33m[%v]\033[0m\t[ROUTER] [%s] [Response]\t %s\n", xReqid, time.Now().Format(defaultTimestampFormat), guest, response)
				}

				fields := Fields{
					"IP":       c.ClientIP(),
					"x-reqid":  xReqid,
					"Start":    start.Format(defaultTimestampFormat),
					"Response": response,
				}
				routerLogger.WithFields(fields).Errorf("%s\t%d\t%s", c.Request.Method, c.Writer.Status(), path)
				w.Flush()
			}()
		}

		// Log only when path is not being skipped
		if _, ok := skip[path]; !ok {
			end := time.Now()
			latency := end.Sub(start)
			statusCode := c.Writer.Status()
			statusColor := colorForStatus(statusCode)
			clientIP := c.ClientIP()
			method := c.Request.Method
			methodColor := colorForMethod(method)
			comment := c.Errors.ByType(gin.ErrorTypePrivate).String()

			fmt.Fprintf(out, "[%s] \033[33m[%v]\033[0m\t[ROUTER] [Completed] [%s] |%s %3d %s| %13v | %s | %s %s %s| %s\n%s\n",
				xReqid,
				end.Format(defaultTimestampFormat),
				guest,
				statusColor, statusCode, reset,
				latency,
				clientIP,
				methodColor, method, reset,
				c.Request.URL.String(),
				comment,
			)
			latencyTollLongBell(latency, c, xReqid, guest)
		}
	}
}

func colorForStatus(code int) string {
	switch {
	case code >= 200 && code < 300:
		return green
	case code >= 300 && code < 400:
		return white
	case code >= 400 && code < 500:
		return yellow
	default:
		return red
	}
}

func colorForMethod(method string) string {
	switch method {
	case "GET":
		return blue
	case "POST":
		return cyan
	case "PUT":
		return yellow
	case "DELETE":
		return red
	case "PATCH":
		return green
	case "HEAD":
		return magenta
	case "OPTIONS":
		return white
	default:
		return reset
	}
}

// latencyTollLongBell 如果耗时大于 300ms 则打印警告信息
func latencyTollLongBell(latency time.Duration, c *gin.Context, xReqid, guest string) {
	if latency > time.Millisecond*300 {
		fields := Fields{
			"Status":  c.Writer.Status(),
			"x-reqid": xReqid,
			"Latency": latency,
			"Guest":   guest,
			"URL":     c.Request.Host + c.Request.URL.String(),
		}
		path := c.Request.URL.Path
		routerLogger.WithFields(fields).Warningf("Latency Too Long!!! \t%s", path)
	}
}
