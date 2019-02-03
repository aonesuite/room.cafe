package account

import (
	"net/http"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"room.cafe/models"

	"components/config"
	"components/db"
	"components/log"
)

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
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": result.Error.Error(), "code": "BAD_REQUEST"})
		}
		return
	}

	var user models.User
	if result := database.First(&user, "id = ?", userToken.UserID); result.Error != nil {
		if result.RecordNotFound() {
			c.JSON(http.StatusOK, gin.H{"signed_in": false})
		} else {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": result.Error.Error(), "code": "BAD_REQUEST"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"signed_in": true,
		"id":        user.ID,
		"name":      user.Name,
		"email":     user.Email,
		"gender":    user.Gender,
	})
}
