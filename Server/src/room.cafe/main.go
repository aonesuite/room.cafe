package main

import (
	"flag"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"

	"components/config"
	"components/db"
	"components/log"
	"components/middleware"

	"room.cafe/account"
	"room.cafe/models"
	"room.cafe/room"
)

func loadConfig() {
	flag.Parse()
	config.SetConfigType("yaml")
	config.AddConfigPath(".")
	config.AddConfigPath("$HOME/.room.cafe")
	config.SetConfigName("config")

	err := config.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s", err))
	}

}

func init() {
	loadConfig()

	// 初始化数据库配置
	driver := db.Driver{}
	err := config.UnmarshalKey("database", &driver)
	if err != nil {
		panic(fmt.Errorf("Fatal error unmarsha config: %s", err))
	}

	db.RegisterDatabase(driver)
}

func main() {
	fmt.Println("room.cafe")

	// 自动迁移数据库
	models.AutoMigrate()

	binding.Validator = new(middleware.DefaultValidator)

	engine := gin.New()

	engine.Use(gin.Recovery())
	engine.Use(log.RouterLogger(nil)) // Set router logger

	engine.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	engine.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	engine.GET("/user/state", account.State) // 用户当前状态

	engine.POST("/room", room.Create)    // 创建房间
	engine.GET("/room/:uuid", room.Info) // 房间信息

	engine.Run(":" + config.GetString("app.port"))
}
