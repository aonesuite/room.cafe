package testhelper

import (
	"room.cafe/components/log"

	"github.com/gin-gonic/gin"
)

// DefaultRouter return a gin router
func DefaultRouter() *gin.Engine {
	engine := gin.New()

	engine.Use(gin.Recovery())
	engine.Use(log.RouterLogger(nil))

	engine.Use(func(c *gin.Context) {

	})

	engine.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	return engine
}
