package models

import (
	"components/db"
	"components/log"
)

// AutoMigrate 自动迁移数据库
// 注意: 不会删除字段或索引，对于过期的字段或索引需要手动删除
func AutoMigrate() {

	var (
		log = log.New()
		db  = db.Get(log.ReqID())
	)

	log.Info("auto migrate database")

	err := db.AutoMigrate(
		&User{},
		&UserToken{},
		&Room{},
		&Attendee{},
		&Message{},
	).Error

	if err != nil {
		log.Panic(err.Error())
	}
}
