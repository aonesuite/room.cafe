package account

import (
	"net/http"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"room.cafe/models"

	"room.cafe/components/config"
	"room.cafe/components/db"
	"room.cafe/components/log"
)

// Logout 退出登录
// DELETE /logout
func Logout(c *gin.Context) {
	var (
		log       = log.New(c)
		database  = db.Get(log.ReqID())
		userToken = c.MustGet("currentUserToken").(*models.UserToken)
	)

	var (
		host   = config.GetString("app.host")
		secure = config.GetBool("app.secure")
	)
	c.SetCookie("ROOMCAFE", "", 0, "/", host, secure, true)

	if err := database.Delete(userToken, "id = ?", userToken.ID).Error; err != nil {
		log.Error(err.Error())
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error(), "code": "BAD_REQUEST"})
		return
	}

	c.Status(http.StatusOK)
}

// State 用户信息
func State(c *gin.Context) {
	var (
		log            = log.New(c)
		authToken, err = c.Cookie("ROOMCAFE")
	)

	if len(authToken) == 0 {
		authHeader := c.GetHeader("Authorization")
		authToken = strings.TrimPrefix(authHeader, "Bearer ")
	}

	if len(authToken) == 0 {
		c.JSON(http.StatusOK, gin.H{"signed_in": false})
		return
	}

	var userToken models.UserToken
	_, err = jwt.ParseWithClaims(authToken, &userToken, func(*jwt.Token) (interface{}, error) {
		return []byte(config.GetString("app.secret")), nil
	})

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"signed_in": false})
		return
	}

	database := db.Get(log.ReqID())

	if result := database.First(&userToken, "id = ?", userToken.ID); result.Error != nil {
		if result.RecordNotFound() {
			c.JSON(http.StatusOK, gin.H{"signed_in": false})
		} else {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": result.Error.Error(), "code": "INTERNAL_SERVER_ERROR"})
		}
		return
	}

	var user models.User
	if result := database.First(&user, "id = ?", userToken.UserID); result.Error != nil {
		if result.RecordNotFound() {
			c.JSON(http.StatusOK, gin.H{"signed_in": false})
		} else {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": result.Error.Error(), "code": "INTERNAL_SERVER_ERROR"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"signed_in": true,
		"id":        user.ID,
		"name":      user.Name,
		"email":     user.Email,
		"gender":    user.Gender,
		"avatar":    user.Avatar,
	})
}
