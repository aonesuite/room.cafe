package testhelper

import "components/db"

// InitTestDatabase init test env database
func InitTestDatabase() {
	driver := db.Driver{
		Driver:   "mysql",
		User:     "root",
		Password: "",
		Host:     "127.0.0.1",
		Port:     "3306",
		Name:     "room_cafe_test",
		Default:  true,
	}

	db.RegisterDatabase(driver)
}
