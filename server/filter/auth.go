package filter

import (
	"net/http"
	"strings"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"

	"room.cafe/components/config"
	"room.cafe/components/db"
	"room.cafe/components/log"

	"room.cafe/models"
)

// Auth 接口鉴权
func Auth(c *gin.Context) {
	var (
		log            = log.New(c)
		authToken, err = c.Cookie("ROOMCAFE") // 从 Cookie 中获取 token
	)

	// 从请求头中获取 token
	if len(authToken) == 0 {
		authHeader := c.GetHeader("Authorization")
		authToken = strings.TrimPrefix(authHeader, "Bearer ")
	}

	if len(authToken) == 0 {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// 验证 token
	var userToken models.UserToken
	_, err = jwt.ParseWithClaims(authToken, &userToken, func(*jwt.Token) (interface{}, error) {
		return []byte(config.GetString("app.secret")), nil
	})

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	database := db.Get(log.ReqID())

	if result := database.First(&userToken, "id = ?", userToken.ID); result.Error != nil {
		if result.RecordNotFound() {
			c.AbortWithStatus(http.StatusUnauthorized)
		} else {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": result.Error.Error(), "code": "INTERNAL_SERVER_ERROR"})
		}
		return
	}

	var user models.User
	if result := database.First(&user, "id = ?", userToken.UserID); result.Error != nil {
		if result.RecordNotFound() {
			c.AbortWithStatus(http.StatusUnauthorized)
		} else {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": result.Error.Error(), "code": "INTERNAL_SERVER_ERROR"})
		}
		return
	}

	c.Set("currentUserToken", &userToken)
	c.Set("currentUser", &user)

	if c.Request.URL.Path != "/logout" {
		database.Model(&userToken).Where("id = ?", userToken.ID).Update(db.H{
			"ip":         c.ClientIP(),
			"user_agent": c.GetHeader("User-Agent"),
			"activity":   time.Now().Unix(),
		})
	}

	c.Next()
}
