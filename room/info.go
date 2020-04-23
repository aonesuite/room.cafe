package room

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"

	"room.cafe/components/db"
	"room.cafe/components/log"

	"room.cafe/models"
)

// Info 房间信息
// GET	/room/:uuid
func Info(c *gin.Context) {
	var room = c.MustGet("room").(*models.Room)
	c.JSON(http.StatusOK, room)
}

// middleware

// Room 房间信息
func Room(c *gin.Context) {
	var (
		log         = log.New(c)
		currentUser = c.MustGet("currentUser").(*models.User)
		uuid        = c.Param("uuid")
		database    = db.Get(log.ReqID())
		room        = models.Room{}
	)

	result := database.Preload("Attendees", func(db *gorm.DB) *gorm.DB {
		return db.Select([]string{
			"attendees.id",
			"attendees.user_id",
			"attendees.room_id",
			"attendees.role",
			"IFNULL(attendees.name, users.name) name",
			"attendees.created_at",
			"attendees.updated_at",
			"users.name",
			"users.avatar",
			"users.gender",
		}).Joins("LEFT JOIN users ON users.id = attendees.user_id")
	})

	if result.First(&room, "uuid = ?", uuid); result.Error != nil {
		if result.RecordNotFound() {
			log.Error("the room doesn't exist", result.Error)
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "the room doesn't exist", "code": "ROOM_NOT_FOUND"})
		} else {
			log.Error("find room failed", result.Error)
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get room info failed", "code": "INTERNAL_SERVER_ERROR"})
		}
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

	c.Set("room", &room)
	c.Next()
}
