package db

import (
	"github.com/jinzhu/gorm"
)

// CustomQueryWithRows 自定义查询，返回 rows, 并解析 rows 数据到传入的 []struct
func CustomQueryWithRows(database *gorm.DB, sql string, ret interface{}) (err error) {

	return
}
