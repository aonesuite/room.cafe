package account_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"

	"components/config"
	"components/db"
	"components/log"
	"components/testhelper"

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
