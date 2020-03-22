package log

import (
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func performRequest(r http.Handler, method, path string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestGenReqID(t *testing.T) {
	reqid := GenReqID()
	assert.NotEmpty(t, reqid)
}

func TestRouterLogger(t *testing.T) {
	buffer := new(bytes.Buffer)
	router := gin.New()

	store := cookie.NewStore([]byte("secret"))
	router.Use(sessions.Sessions("mysession", store))

	router.Use(WithWriter(buffer, nil))
	router.GET("/example", func(c *gin.Context) {})
	router.POST("/example", func(c *gin.Context) {})
	router.PUT("/example", func(c *gin.Context) {})
	router.DELETE("/example", func(c *gin.Context) {})
	router.PATCH("/example", func(c *gin.Context) {})
	router.HEAD("/example", func(c *gin.Context) {})
	router.OPTIONS("/example", func(c *gin.Context) {})

	performRequest(router, "GET", "/example")
	assert.Contains(t, buffer.String(), "200")
	assert.Contains(t, buffer.String(), "GET")
	assert.Contains(t, buffer.String(), "/example")

	// I wrote these first (extending the above) but then realized they are more
	// like integration tests because they test the whole logging process rather
	// than individual functions.  Im not sure where these should go.

	performRequest(router, "POST", "/example")
	assert.Contains(t, buffer.String(), "200")
	assert.Contains(t, buffer.String(), "POST")
	assert.Contains(t, buffer.String(), "/example")

	performRequest(router, "PUT", "/example")
	assert.Contains(t, buffer.String(), "200")
	assert.Contains(t, buffer.String(), "PUT")
	assert.Contains(t, buffer.String(), "/example")

	performRequest(router, "DELETE", "/example")
	assert.Contains(t, buffer.String(), "200")
	assert.Contains(t, buffer.String(), "DELETE")
	assert.Contains(t, buffer.String(), "/example")

	performRequest(router, "PATCH", "/example")
	assert.Contains(t, buffer.String(), "200")
	assert.Contains(t, buffer.String(), "PATCH")
	assert.Contains(t, buffer.String(), "/example")

	performRequest(router, "HEAD", "/example")
	assert.Contains(t, buffer.String(), "200")
	assert.Contains(t, buffer.String(), "HEAD")
	assert.Contains(t, buffer.String(), "/example")

	performRequest(router, "OPTIONS", "/example")
	assert.Contains(t, buffer.String(), "200")
	assert.Contains(t, buffer.String(), "OPTIONS")
	assert.Contains(t, buffer.String(), "/example")

	performRequest(router, "GET", "/notfound")
	assert.Contains(t, buffer.String(), "404")
	assert.Contains(t, buffer.String(), "GET")
	assert.Contains(t, buffer.String(), "/notfound")

}

func TestColorForMethod(t *testing.T) {
	assert.Equal(t, colorForMethod("GET"), string([]byte{27, 91, 57, 55, 59, 52, 52, 109}), "get should be blue")
	assert.Equal(t, colorForMethod("POST"), string([]byte{27, 91, 57, 55, 59, 52, 54, 109}), "post should be cyan")
	assert.Equal(t, colorForMethod("PUT"), string([]byte{27, 91, 57, 55, 59, 52, 51, 109}), "put should be yellow")
	assert.Equal(t, colorForMethod("DELETE"), string([]byte{27, 91, 57, 55, 59, 52, 49, 109}), "delete should be red")
	assert.Equal(t, colorForMethod("PATCH"), string([]byte{27, 91, 57, 55, 59, 52, 50, 109}), "patch should be green")
	assert.Equal(t, colorForMethod("HEAD"), string([]byte{27, 91, 57, 55, 59, 52, 53, 109}), "head should be magenta")
	assert.Equal(t, colorForMethod("OPTIONS"), string([]byte{27, 91, 57, 48, 59, 52, 55, 109}), "options should be white")
	assert.Equal(t, colorForMethod("TRACE"), string([]byte{27, 91, 48, 109}), "trace is not defined and should be the reset color")
}

func TestColorForStatus(t *testing.T) {
	assert.Equal(t, colorForStatus(200), string([]byte{27, 91, 57, 55, 59, 52, 50, 109}), "2xx should be green")
	assert.Equal(t, colorForStatus(301), string([]byte{27, 91, 57, 48, 59, 52, 55, 109}), "3xx should be white")
	assert.Equal(t, colorForStatus(404), string([]byte{27, 91, 57, 55, 59, 52, 51, 109}), "4xx should be yellow")
	assert.Equal(t, colorForStatus(2), string([]byte{27, 91, 57, 55, 59, 52, 49, 109}), "other things should be red")
}

func TestErrorLogger(t *testing.T) {
	router := gin.New()
	router.Use(ErrorLogger())
	router.GET("/error", func(c *gin.Context) {
		c.Error(errors.New("this is an error"))
	})
	router.GET("/abort", func(c *gin.Context) {
		c.AbortWithError(401, errors.New("no authorized"))
	})
	router.GET("/print", func(c *gin.Context) {
		c.Error(errors.New("this is an error"))
		c.String(500, "hola!")
	})

	w := performRequest(router, "GET", "/error")
	assert.Equal(t, w.Code, 200)
	assert.Equal(t, w.Body.String(), "{\"error\":\"this is an error\"}")

	w = performRequest(router, "GET", "/abort")
	assert.Equal(t, w.Code, 401)
	assert.Equal(t, w.Body.String(), "{\"error\":\"no authorized\"}")

	w = performRequest(router, "GET", "/print")
	assert.Equal(t, w.Code, 500)
	assert.Equal(t, w.Body.String(), "hola!{\"error\":\"this is an error\"}")
}

func TestSkippingPaths(t *testing.T) {
	buffer := new(bytes.Buffer)
	router := gin.New()

	store := cookie.NewStore([]byte("secret"))
	router.Use(sessions.Sessions("mysession", store))

	router.Use(WithWriter(buffer, &RouterLoggerCall{
		Notlogged: []string{"/skipped"},
	}))
	router.GET("/logged", func(c *gin.Context) {})
	router.GET("/skipped", func(c *gin.Context) {})

	performRequest(router, "GET", "/logged")
	assert.Contains(t, buffer.String(), "200")

	performRequest(router, "GET", "/skipped")
	assert.Contains(t, buffer.String(), "")
}

// func TestSlack(t *testing.T) {
// 	// assert := assert.New(t)

// 	logrus.SetFormatter(&logrus.TextFormatter{})

// 	logrus.SetOutput(os.Stderr)

// 	logrus.SetLevel(logrus.DebugLevel)

// 	logrus.AddHook(&slackrus.SlackrusHook{
// 		HookURL:        config.Slack.MartianWebhook,
// 		AcceptedLevels: slackrus.LevelThreshold(logrus.DebugLevel),
// 		Channel:        "#mars-exception",
// 		Username:       "Martian",
// 	})

// 	logrus.WithFields(logrus.Fields{"foo": "bar", "foo2": 42}).Warn("this is a warn level message")
// 	logrus.Info("this is an info level message")
// 	logrus.Debug("this is a debug level message")
// 	logrus.Error("this is a error level message")
// }
