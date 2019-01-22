package mock

import (
	"net/http/httptest"

	"github.com/gin-gonic/gin"
)

// NewMockServer return mock http test server
func NewMockServer() *httptest.Server {

	mux := gin.New()

	mux.POST("/v2/sms/tpl_single_send.json", SMSTplSingleSend) // 单条模板短信接口
	mux.POST("/v2/voice/send.json", SMSVoiceSend)              // 语言验证码

	return httptest.NewServer(mux)
}

// SMSTplSingleSend 单条模板短信接口
func SMSTplSingleSend(c *gin.Context) {
	c.JSON(200, gin.H{
		"code":   0,
		"msg":    "发送成功",
		"count":  1,
		"fee":    0.05,
		"unit":   "RMB",
		"mobile": "13000000000",
		"sid":    3310228978,
	})
}

// SMSVoiceSend 语言验证码
func SMSVoiceSend(c *gin.Context) {
	c.JSON(200, gin.H{
		"count": 1,
		"fee":   0.05,
		"sid":   "931ee0bac7494aab8a422fff5c6be3ea",
	})
}
