package room_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"components/config"
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

func mock() *httptest.Server {
	r := gin.New()

	r.POST("/room", func(c *gin.Context) {
		c.Writer.WriteHeader(200)
		c.Writer.Write([]byte(`{"code":200,"msg":{"roomToken":"222222222", "room":{"uuid":"1232321312312321"}}}`))
	})

	r.POST("/room/join", func(c *gin.Context) {
		c.JSON(200, gin.H{"code": 200, "msg": gin.H{"roomToken": "12134552312"}})
	})

	return httptest.NewServer(r)
}

func init() {

	server := mock()
	config.Set("herewhite.mini_token", "herewhite_mini_token")
	config.Set("herewhite.host", server.URL)

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
	assert.NotEmpty(room.Owner)
	assert.NotEmpty(room.RTCToken)
	assert.NotEmpty(room.Whiteboard)
	assert.NotEmpty(room.WhiteboardToken)

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
		assert.NotEmpty(room.Owner)
		assert.NotEmpty(room.RTCToken)
		assert.NotEmpty(room.Whiteboard)
		assert.NotEmpty(room.WhiteboardToken)
	}
}
