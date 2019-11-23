package room

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"components/config"
	"components/db"
	"components/log"

	"providers/agora"
	"providers/white"

	"room.cafe/models"
)

// Info 房间信息
// GET	/room/:uuid
func Info(c *gin.Context) {
	log := log.New(c)
	currentUser := c.MustGet("currentUser").(*models.User)
	uuid := c.Param("uuid")

	database := db.Get(log.ReqID())

	room := models.Room{}

	if result := database.First(&room, "uuid = ?", uuid); result.Error != nil {
		if result.RecordNotFound() {
			log.Error("the room doesn't exist", result.Error)
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "the room doesn't exist", "code": "ROOM_NOT_FOUND"})
		} else {
			log.Error("find room failed", result.Error)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get room info failed", "code": "INTERNAL_SERVER_ERROR"})
		}
		return
	}

	var (
		err      error
		expireAt = time.Now().Unix() + 600
	)

	room.RTCToken, err = agora.GenJoinChannelToken(config.GetString("agora.app_id"), config.GetString("agora.app_certificate"), uuid, currentUser.RoomUserID(), expireAt)
	if err != nil {
		log.Error("get rtn room token failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get room info failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	// 获取白板 token
	whiteClient := white.NewClient(config.GetString("herewhite.mini_token"), config.GetString("herewhite.host"))

	room.WhiteboardToken, err = whiteClient.GetRoomToken(log, room.Whiteboard)
	if err != nil {
		log.Error("get join white room token failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get room info failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	// 获取房间人员
	attendee := models.Attendee{
		UserID: currentUser.ID,
		RoomID: room.ID,
	}

	if err := database.FirstOrCreate(&attendee).Error; err != nil {
		log.Error("room add attendee failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get room info failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	c.JSON(http.StatusOK, room)
}
