package uploader_test

import (
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"components/testhelper"

	"room.cafe/uploader"
)

var router *gin.Engine

func init() {
	router = testhelper.DefaultRouter()

	router.GET("/uploader/token", uploader.MakeUploadToken)
}

func TestMakeUploadToken(t *testing.T) {
	assert := assert.New(t)

	w := testhelper.PerformRequest(router, "GET", "/uploader/token", nil)
	assert.Equal(w.Code, http.StatusOK)
}
