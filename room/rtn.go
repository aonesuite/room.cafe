package room

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"room.cafe/components/config"
	"room.cafe/components/log"

	"room.cafe/providers/agora"

	"room.cafe/models"
)

// RTN rtc & rtm info
// GET /room/:uuid/rtn
func RTN(c *gin.Context) {
	var (
		log         = log.New(c)
		currentUser = c.MustGet("currentUser").(*models.User)
		room        = c.MustGet("room").(*models.Room)
		err         error
		expireAt    = uint32(time.Now().Unix() + 600)
	)

	rtn := models.RTN{
		AppID:          config.GetString("agora.app_id"),
		AppCertificate: config.GetString("agora.app_certificate"),
		Channel:        room.UUID,
		UID:            uint32(currentUser.ID),
	}

	rtn.RTCToken, err = agora.BuildRTCTokenWithUID(rtn.AppID, rtn.AppCertificate, rtn.Channel, rtn.UID, agora.RoleAttendee, expireAt)
	if err != nil {
		log.Error("get rtn room token failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get room info failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	rtn.RTMToken, err = agora.BuildRTMTokenWithUID(rtn.AppID, rtn.AppCertificate, rtn.UID, agora.RoleRtmUser, expireAt)
	if err != nil {
		log.Error("get rtm room token failed ", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "get room info failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	c.JSON(http.StatusOK, rtn)
}
