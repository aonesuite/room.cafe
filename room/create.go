package room

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/globalsign/mgo/bson"

	"room.cafe/components/db"
	"room.cafe/components/log"

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

	database := db.Get(log.ReqID())
	tx := database.Begin()

	room := models.Room{
		UUID:    bson.NewObjectId().Hex(),
		Name:    args.Name,
		Private: args.Private,
		Owner:   currentUser.ID,
	}

	// 创建房间
	if err := tx.Create(&room).Error; err != nil {
		tx.Rollback()
		log.Error("create room failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	attendee := models.Attendee{
		UserID: currentUser.ID,
		RoomID: room.ID,
		Role:   models.RoleOwner,
	}

	// 添加成员
	if err := tx.Create(&attendee).Error; err != nil {
		tx.Rollback()
		log.Error("room add attendee failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		log.Error("database commit failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create room failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	c.JSON(http.StatusCreated, room)
}
