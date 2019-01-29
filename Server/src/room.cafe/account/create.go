package account

import (
	"components/config"
	"components/db"
	"components/log"
	"components/timestamp"
	"net/http"
	"time"

	"room.cafe/models"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/now"
)

// CreateArgs create user args
type CreateArgs struct {
	Name   string `json:"name"`   // 昵称
	Email  string `json:"email"`  // 邮箱
	Gender string `json:"gender"` // 性别
}

// Create 创建用户
func Create(c *gin.Context) {
	var (
		log      = log.New(c)
		database = db.Get(log.ReqID())
		args     CreateArgs
		timeNow  = timestamp.Now()
	)

	if c.Request.Body == nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "invalid args", "code": "INVALID_ARGS"})
		return
	}

	if err := c.BindJSON(&args); err != nil {
		log.Error("bind create room args failed", err.Error())
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "invalid args", "code": "INVALID_ARGS"})
		return
	}

	user := models.User{
		Name:   args.Name,
		Email:  args.Email,
		Gender: args.Gender,

		CurrentSignInAt: timeNow,
		CurrentSignInIP: c.ClientIP(),
	}

	tx := database.Begin()

	// 创建用户
	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		log.Error("create user failed", err.Error())
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create user failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	var (
		expire = now.New(timeNow.Add(time.Hour*24*7)).EndOfDay().Unix() - timeNow.Unix()
	)

	userToken := models.UserToken{
		UserID:    user.ID,
		IssureAt:  timeNow.Unix(),
		Expire:    expire,
		IP:        c.ClientIP(),
		UserAgent: c.GetHeader("user-agent"),
	}

	// 创建 token
	if err := tx.Create(&userToken).Error; err != nil {
		log.Error("create user token failed", err.Error())
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create user failed", "code": "INTERNAL_SERVER_ERROR"})
		tx.Rollback()
		return
	}

	// JWT 签名
	var (
		token  = jwt.NewWithClaims(jwt.SigningMethodHS256, &userToken)
		secret = config.GetString("app.secret")
	)

	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Error("sign user token failed", err.Error())
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create user failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	tx.Commit()

	var (
		host   = config.GetString("app.host")
		secure = config.GetBool("app.secure")
	)

	c.SetCookie("ROOMCAFE", signed, int(userToken.Expire), "/", host, secure, true)

	c.JSON(http.StatusCreated, gin.H{
		"name":   user.Name,
		"email":  user.Email,
		"gender": user.Gender,
		"token":  signed,
	})
}
