package uploader

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/qiniu/api.v7/auth/qbox"
	"github.com/qiniu/api.v7/storage"

	"components/config"
	"components/log"
)

// QiniuConfig qiniu service config
type QiniuConfig struct {
	AccessKey string `mapstructure:"access_key"`
	SecretKey string `mapstructure:"secret_key"`
	Bucket    string `mapstructure:"bucket"`
	Domain    string `mapstructure:"domain"`
}

// MakeUploadToken 获取上传 token
func MakeUploadToken(c *gin.Context) {
	var (
		log         = log.New(c)
		qiniuConfig = QiniuConfig{}
	)

	if err := config.UnmarshalKey("qiniu", &qiniuConfig); err != nil {
		log.Error(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		c.Abort()
		return
	}

	// 设置上传的策略
	putPolicy := &storage.PutPolicy{
		Scope:      fmt.Sprintf("%s", qiniuConfig.Bucket),
		Expires:    3600,
		ReturnBody: `{"name":$(fname), "size":$(fsize), "mime_type":$(mimeType), "key":$(key), "imageInfo": $(imageInfo)}`,
	}

	mac := qbox.NewMac(qiniuConfig.AccessKey, qiniuConfig.SecretKey)
	token := putPolicy.UploadToken(mac)
	expireAt := time.Now().Unix() + 3600

	c.Header("uploader-token", token)
	c.Header("uploader-domain", qiniuConfig.Domain)
	c.Header("token-expire-at", fmt.Sprintf("%d", expireAt))

	c.JSON(200, gin.H{
		"token":     token,
		"domain":    qiniuConfig.Domain,
		"expire_at": expireAt,
	})
}

// MakeDownloadToken 获取下载地址
func MakeDownloadToken(c *gin.Context) {
	var (
		key       = c.Param("key")
		cdnDomain = config.GetString("qiniu.private_domain")
		mac       = qbox.NewMac(config.GetString("qiniu.access_key"), config.GetString("qiniu.secret_key"))
		duration  = 365 * 24 * 3600
		expiry    = time.Now().Add(time.Duration(duration) * time.Second).Unix()
		url       = storage.MakePrivateURL(mac, cdnDomain, key, expiry)
	)

	c.JSON(200, gin.H{
		"url": url,
	})
}
