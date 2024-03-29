package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"

	"room.cafe/components/config"
	"room.cafe/components/db"
	"room.cafe/components/log"
	"room.cafe/components/middleware"

	"room.cafe/account"
	"room.cafe/filter"
	"room.cafe/models"
	"room.cafe/room"
	"room.cafe/uploader"
)

// InitConfig init application config
func InitConfig() {
	config.SetConfigType("yaml")

	var confPath string
	flag.StringVar(&confPath, "f", "", "-f=/path/to/config")
	flag.Parse()

	file, err := os.Open(confPath)
	if err != nil {
		return
	}

	defer file.Close()

	if err = config.ReadConfig(file); err != nil {
		panic(fmt.Errorf("Fatal error read config file: %s", err))
	}

	// 初始化数据库配置
	driver := db.Driver{}
	if err = config.UnmarshalKey("database", &driver); err != nil {
		panic(fmt.Errorf("Fatal error unmarsha config: %s", err))
	}

	account.Init()
	db.RegisterDatabase(driver)
}

func main() {
	fmt.Println("room.cafe")

	InitConfig()

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

	group := engine.Group("action")

	group.GET("/user/state", account.State) // 用户当前状态
	group.POST("/user", account.Create)     // 创建用户

	group.GET("/authorize/:provider/callback", account.Callback) // oauth2 回调
	group.GET("/authorize/:provider", account.AuthCodeURL)       // 获取 redirect url

	router := group.Group("/", filter.Auth)
	{
		router.DELETE("/user/logout", account.Logout) // 退出登录

		router.GET("/uploader/token", uploader.MakeUploadToken)      // 上传 token
		router.GET("/uploader/url/:key", uploader.MakeDownloadToken) // 下载 url

		rooms := router.Group("/room")
		rooms.POST("", room.Create)                                // 创建房间
		rooms.GET("/:uuid", room.Room, room.Info)                  // 房间信息
		rooms.GET("/:uuid/rtn", room.Room, room.RTN)               // 房间 RTC 信息
		rooms.GET("/:uuid/whiteboard", room.Room, room.Whiteboard) // 房间白板信息
	}

	// engine.Run(":" + config.GetString("app.port"))

	srv := &http.Server{
		Addr:    ":" + config.GetString("app.port"),
		Handler: engine,
	}

	if config.GetString("app.mode") == gin.DebugMode {
		fmt.Printf("Listening and serving HTTP on %s\n", srv.Addr)
		if err := srv.ListenAndServeTLS("./certificate/dev.room.cafe.crt", "./certificate/dev.room.cafe.key"); err != nil {
			fmt.Printf("Failed to listen and serve %v", err)
			os.Exit(1)
		}

	} else {
		gin.SetMode(gin.ReleaseMode)
		if err := srv.ListenAndServe(); err != nil {
			fmt.Printf("Failed to listen and serve %v", err)
			os.Exit(1)
		}
	}
}
