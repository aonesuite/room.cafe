package account_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"room.cafe/components/config"
	"room.cafe/components/db"
	"room.cafe/components/log"
	"room.cafe/components/testhelper"

	"room.cafe/account"
	"room.cafe/models"
)

const (
	TestMobile = "13800000000"
	TestIP     = "233.233.233.233"
)

var router *gin.Engine

func init() {

	testhelper.InitTestDatabase()

	config.Set("app.host", "room.cafe")
	config.Set("app.port", "8080")
	config.Set("app.secure", false)
	config.Set("app.secret", "ulmTD4DJPs0BX57-d5bxYHNdEQVfdTneCN4-Hc5SkbI")

	var (
		log      = log.New()
		database = db.Get(log.ReqID())
	)

	err := database.DropTableIfExists(
		&models.User{},
		&models.UserToken{},
	).Error
	if err != nil {
		log.Panic(err.Error())
	}

	models.AutoMigrate()

	router = testhelper.DefaultRouter()
	router.GET("/user/state", account.State)
	router.POST("/user", account.Create)
}

var userAuthToken string
var userAuthCookie *http.Cookie

type State struct {
	SignedIn bool `json:"signed_in"`
}

func TestState(t *testing.T) {
	assert := assert.New(t)
	var state State

	w := testhelper.PerformRequest(router, "GET", "/user/state", nil)
	assert.Equal(w.Code, http.StatusOK)

	err := json.Unmarshal(w.Body.Bytes(), &state)
	assert.Nil(err)
	assert.False(state.SignedIn)

	header := http.Header{}
	header.Set("Authorization", fmt.Sprintf("Bearer %s", userAuthToken))
	w = testhelper.PerformRequest(router, "GET", "/user/state", header)
	assert.Equal(w.Code, http.StatusOK)

	err = json.Unmarshal(w.Body.Bytes(), &state)
	assert.Nil(err)
	assert.False(state.SignedIn)

	header = http.Header{}
	header.Add("Cookie", userAuthCookie.String())
	w = testhelper.PerformRequest(router, "GET", "/user/state", header)
	assert.Equal(w.Code, http.StatusOK)

	err = json.Unmarshal(w.Body.Bytes(), &state)
	assert.Nil(err)
	assert.False(state.SignedIn)
}

type UserRet struct {
	Name   string `json:"name"`
	Email  string `json:"email"`
	Gender string `json:"gender"`
	Token  string `json:"token"`
}

func TestCreate(t *testing.T) {
	assert := assert.New(t)

	w := testhelper.PerformRequest(router, "POST", "/user", nil)
	assert.Equal(w.Code, http.StatusBadRequest)

	data := map[string]interface{}{
		"name": "test user",
	}
	msg, _ := json.Marshal(data)
	w = testhelper.PerformRequest(router, "POST", "/user", nil, bytes.NewReader(msg))
	assert.Equal(w.Code, http.StatusCreated)

	var user UserRet
	err := json.Unmarshal(w.Body.Bytes(), &user)
	assert.Nil(err)
	assert.NotEmpty(user.Name)
	assert.NotEmpty(user.Token)
}
