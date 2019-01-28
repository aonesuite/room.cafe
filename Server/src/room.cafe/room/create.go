package room

import (
	"net/http"

	"github.com/globalsign/mgo/bson"

	"github.com/gin-gonic/gin"
	"github.com/qiniu/api.v7/auth/qbox"
	"github.com/qiniu/api.v7/rtc"
	"room.cafe/models"

	"components/config"
	"components/db"
	"components/log"
)

// CreateArgs create room args
type CreateArgs struct {
	Name    string `json:"name"`    // 自定义房间名称
	Private bool   `json:"private"` // 是否为私密房间
}

// Create 创建房间
func Create(c *gin.Context) {
	log := log.New(c)
	currentUser := c.MustGet("currentUser").(*models.User)
	args := CreateArgs{}

	if err := c.BindJSON(&args); err != nil {
		log.Error("bind create room args failed", err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "invalid args", "code": "INVALID_ARGS"})
		return
	}

	mac := &qbox.Mac{
		AccessKey: config.GetString("qiniu.access_key"),
		SecretKey: []byte(config.GetString("qiniu.secret_key")),
	}

	uuid := bson.NewObjectId().Hex()

	rtcMgr := rtc.NewManager(mac)

	roomAccess := rtc.RoomAccess{
		AppID:      config.GetString("qiniu.rtn_appid"),
		RoomName:   uuid,
		UserID:     currentUser.RoomUserID(),
		ExpireAt:   60 * 60 * 12,
		Permission: "admin",
	}

	roomToken, err := rtcMgr.GetRoomToken(roomAccess)
	if err != nil {
		log.Error("get rtn room token failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	database := db.Get(log.ReqID())
	database = database.Begin()

	room := models.Room{
		UUID:      uuid,
		Name:      args.Name,
		Private:   args.Private,
		Owner:     currentUser.ID,
		RoomID:    roomAccess.RoomName,
		RoomToken: roomToken,
	}

	// 创建房间
	if err := database.Create(&room).Error; err != nil {
		database.Rollback()
		log.Error("create room failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	attendee := models.Attendee{
		UserID: currentUser.ID,
		RoomID: room.ID,
	}

	if err := database.Create(&attendee).Error; err != nil {
		database.Rollback()
		log.Error("room add attendee failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	database.Commit()

	c.JSON(http.StatusCreated, room)

}
