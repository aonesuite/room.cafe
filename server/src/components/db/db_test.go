package db_test

import (
	"bytes"
	"testing"

	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"

	"components/db"
)

func TestInit(t *testing.T) {
	assert := assert.New(t)

	viper.SetConfigType("yaml")

	var config = []byte(`
    database:
      driver: mysql
      user: root
      host: 127.0.0.1
      port: 3306
      name: room_cafe_test
  `)

	err := viper.ReadConfig(bytes.NewBuffer(config))
	assert.Nil(err)

	driver := db.Driver{
		Driver:     viper.GetString("database.driver"),
		User:       viper.GetString("database.user"),
		Password:   viper.GetString("database.password"),
		Host:       viper.GetString("database.host"),
		SSLMode:    viper.GetString("database.ssl_mode"),
		Port:       viper.GetString("database.port"),
		Name:       viper.GetString("database.name"),
		DisableLog: viper.GetBool("database.disable_log"),
		Alias:      viper.GetString("database.alias"),
		Default:    viper.GetBool("database.default"),
	}

	db.RegisterDatabase(driver)

	assert.NotNil(db.Get())
	assert.NotNil(db.Get(db.GenReqID()))
	assert.NotNil(db.GetWithAlias("room_cafe_test"))
	assert.NotNil(db.GetWithAlias("room_cafe_test", db.GenReqID()))
}

func TestDB(t *testing.T) {
	assert := assert.New(t)

	type TestUser struct {
		ID   uint
		Name string
	}

	db := db.Get()

	err := db.DropTableIfExists(&TestUser{}).Error
	assert.NoError(err)

	err = db.CreateTable(&TestUser{}).Error
	assert.NoError(err)
}
