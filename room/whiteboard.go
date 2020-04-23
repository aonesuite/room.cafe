package room

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"room.cafe/components/config"
	"room.cafe/components/db"
	"room.cafe/components/log"
	"room.cafe/models"
	"room.cafe/providers/white"
)

// Whiteboard 白板信息
// GET	/room/:uuid
func Whiteboard(c *gin.Context) {
	var (
		log    = log.New(c)
		room   = c.MustGet("room").(*models.Room)
		client = white.NewClient(config.GetString("herewhite.mini_token"), config.GetString("herewhite.host"))
	)

	// 如果房间白板 ID 不为空，说明此前已创建过白板
	if room.WhiteboardID != "" {
		whiteboardToken, err := client.GetRoomToken(log, room.WhiteboardID)
		if err != nil {
			log.Error("get join white room token failed", err)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get whiteboard info failed", "code": "INTERNAL_SERVER_ERROR"})
			return
		}

		whiteboard := models.Whiteboard{
			WhiteboardID:    room.WhiteboardID,
			WhiteboardToken: whiteboardToken,
		}

		c.JSON(http.StatusOK, whiteboard)
		return
	}

	whiteArgs := white.ReqCreateWhite{Name: room.UUID, Limit: 100}
	whiteRet, err := client.CreateWhite(log, whiteArgs)
	if err != nil {
		log.Error("create white room failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get whiteboard info failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	whiteboard := models.Whiteboard{
		WhiteboardID:    whiteRet.Room.UUID,
		WhiteboardToken: whiteRet.RoomToken,
	}

	database := db.Get(log.ReqID())
	if err := database.Model(room).Where("id = ?", room.ID).Update(db.H{"whiteboard_id": whiteRet.Room.UUID}).Error; err != nil {
		log.Error("create white room failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get whiteboard info failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	c.JSON(http.StatusOK, whiteboard)
}
