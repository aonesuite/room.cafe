package room_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"components/db"
	"components/log"
	"components/testhelper"

	"room.cafe/models"
	"room.cafe/room"
)

const (
	TestMobile = "13800000000"
	TestIP     = "233.233.233.233"
)

var router *gin.Engine

func init() {

	testhelper.InitTestDatabase()

	var (
		log      = log.New()
		database = db.Get(log.ReqID())
	)

	err := database.DropTableIfExists(
		&models.Room{},
		&models.Attendee{},
	).Error
	if err != nil {
		log.Panic(err.Error())
	}

	user := models.User{
		ID: 1,
	}

	models.AutoMigrate()

	router = testhelper.DefaultRouter()

	router.Use(func(c *gin.Context) {
		c.Set("currentUser", &user)
	})

	router.POST("/room", room.Create)    // 创建房间
	router.GET("/room/:uuid", room.Info) // 房间信息
}

var rooms []models.Room

func TestCreate(t *testing.T) {
	assert := assert.New(t)

	w := testhelper.PerformRequest(router, "POST", "/room", nil)
	assert.Equal(w.Code, http.StatusCreated)

	var room models.Room
	err := json.Unmarshal(w.Body.Bytes(), &room)
	assert.Nil(err)
	assert.NotEmpty(room.UUID)
	assert.NotEmpty(room.RTCToken)

	rooms = append(rooms, room)

	data := map[string]interface{}{}
	msg, _ := json.Marshal(data)
	w = testhelper.PerformRequest(router, "POST", "/room", nil, bytes.NewReader(msg))
	assert.Equal(w.Code, http.StatusCreated)

	data = map[string]interface{}{
		"name":    "test room",
		"private": true,
	}
	msg, _ = json.Marshal(data)
	w = testhelper.PerformRequest(router, "POST", "/room", nil, bytes.NewReader(msg))
	assert.Equal(w.Code, http.StatusCreated)

	err = json.Unmarshal(w.Body.Bytes(), &room)
	assert.Nil(err)
	assert.NotNil(room.UUID)

	rooms = append(rooms, room)
}

func TestInfo(t *testing.T) {
	assert := assert.New(t)

	for _, room := range rooms {
		w := testhelper.PerformRequest(router, "GET", fmt.Sprintf("/room/%s", room.UUID), nil)
		assert.Equal(w.Code, http.StatusOK)

		var room models.Room
		err := json.Unmarshal(w.Body.Bytes(), &room)
		assert.Nil(err)
		assert.NotEmpty(room.UUID)
		assert.NotEmpty(room.RTCToken)
	}
}
