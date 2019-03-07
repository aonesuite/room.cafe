package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"

	"components/config"
	"components/db"
	"components/log"
	"components/middleware"

	"room.cafe/account"
	"room.cafe/filter"
	"room.cafe/models"
	"room.cafe/room"
)

func init() {
	config.SetConfigType("yaml")
	config.AddConfigPath(".")
	config.AddConfigPath("$HOME/.room.cafe")
	config.SetConfigName("config")

	err := config.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %s", err))
	}

	// 初始化数据库配置
	driver := db.Driver{}
	err = config.UnmarshalKey("database", &driver)
	if err != nil {
		panic(fmt.Errorf("Fatal error unmarsha config: %s", err))
	}

	account.Init()
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

	engine.Use(cors.New(cors.Config{
		AllowWildcard:    true,
		AllowOrigins:     config.GetStringSlice("app.cors.origins"),
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowWebSockets:  true,
		MaxAge:           12 * time.Hour,
	}))

	engine.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	engine.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	engine.GET("/user/state", account.State) // 用户当前状态
	engine.POST("/user", account.Create)     // 创建用户

	engine.GET("/authorize/:provider/callback", account.Callback) // oauth2 回调
	engine.GET("/authorize/:provider", account.AuthCodeURL)       // 获取 redirect url

	router := engine.Group("/", filter.Auth)
	{
		router.DELETE("/user/logout", account.Logout) // 退出登录
		router.POST("/room", room.Create)             // 创建房间
		router.GET("/room/:uuid", room.Info)          // 房间信息
	}

	// engine.Run(":" + config.GetString("app.port"))

	srv := &http.Server{
		Addr:    ":" + config.GetString("app.port"),
		Handler: engine,
	}

	if config.GetString("app.mode") == gin.DebugMode {
		fmt.Printf("Listening and serving HTTP on %s\n", srv.Addr)
		if err := srv.ListenAndServeTLS("../../certificate/dev.room.cafe.crt", "../../certificate/dev.room.cafe.key"); err != nil {
			os.Exit(1)
		}

	} else {
		gin.SetMode(gin.ReleaseMode)
		if err := srv.ListenAndServe(); err != nil {
			os.Exit(1)
		}
	}
}
