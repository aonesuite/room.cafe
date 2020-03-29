package room

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo/bson"

	"room.cafe/components/config"
	"room.cafe/components/db"
	"room.cafe/components/log"

	"room.cafe/providers/agora"
	"room.cafe/providers/white"

	"room.cafe/models"
)

// CreateArgs create room args
type CreateArgs struct {
	Name    string `json:"name"`    // 自定义房间名称
	Private bool   `json:"private"` // 是否为私密房间
}

// Create 创建房间
// POST	/room
func Create(c *gin.Context) {
	log := log.New(c)
	currentUser := c.MustGet("currentUser").(*models.User)
	args := CreateArgs{}

	if c.Request.Body != nil {
		if err := c.Bind(&args); err != nil {
			log.Error("bind create room args failed", err)
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "invalid args", "code": "INVALID_ARGS"})
			return
		}
	}

	var (
		uuid         = bson.NewObjectId().Hex()
		agoraAppID   = config.GetString("agora.app_id")
		agoraAppCert = config.GetString("agora.app_certificate")
		expireAt     = time.Now().Unix() + 600
	)

	roomToken, err := agora.GenRTCJoinChannelToken(agoraAppID, agoraAppCert, uuid, currentUser.RoomUserID(), expireAt)
	if err != nil {
		log.Error("get rtc room token failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	rtmToken, err := agora.GenRTMJoinChannelToken(agoraAppID, agoraAppCert, currentUser.RoomUserID(), expireAt)
	if err != nil {
		log.Error("get rtc room token failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	// 获取白板 token
	whiteClient := white.NewClient(config.GetString("herewhite.mini_token"), config.GetString("herewhite.host"))
	whiteArgs := white.ReqCreateWhite{Name: uuid, Limit: 100}
	whiteRet, err := whiteClient.CreateWhite(log, whiteArgs)
	if err != nil {
		log.Error("create white room failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	database := db.Get(log.ReqID())
	database = database.Begin()

	room := models.Room{
		UUID:    uuid,
		Name:    args.Name,
		Private: args.Private,
		Owner:   currentUser.ID,

		RTCAppID:   agoraAppID,
		RTCChannel: uuid,
		RTCToken:   roomToken,
		RTMToken:   rtmToken,

		Whiteboard:      whiteRet.Room.UUID,
		WhiteboardToken: whiteRet.RoomToken,
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

	room.Attendees = []models.Attendee{attendee}

	c.JSON(http.StatusCreated, room)
}
