package room_test

import (
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

	router.POST("/room", room.Create) // 创建房间
}

func TestCreate(t *testing.T) {
	assert := assert.New(t)

	w := testhelper.PerformRequest(router, "POST", "/room", nil)
	assert.Equal(w.Code, http.StatusCreated)

	// data := map[string]interface{}{
	// 	"name":    "test room",
	// 	"private": true,
	// }
	// msg, _ := json.Marshal(data)
	// w = testhelper.PerformRequest(router, "POST", "/room", nil, bytes.NewReader(msg))
	// assert.Equal(w.Code, http.StatusCreated)
}
