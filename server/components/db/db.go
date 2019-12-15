package db

import (
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/jinzhu/gorm"

	// database drivers
	_ "github.com/jinzhu/gorm/dialects/mysql"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var pid = uint32(time.Now().UnixNano() % 4294967291)

// GenReqID is a random generate string func
func GenReqID() string {
	var b [12]byte
	binary.LittleEndian.PutUint32(b[:], pid)
	binary.LittleEndian.PutUint64(b[4:], uint64(time.Now().UnixNano()))
	return base64.URLEncoding.EncodeToString(b[:])
}

// --------------------------------------------------------------------

const defaultDatabaseKey = "default"

var (
	databaseCache    = make(map[string]*gorm.DB)
	databaseCacheMux sync.RWMutex
)

// Driver database driver args struct
type Driver struct {
	Driver     string `json:"driver"      mapstructure:"driver"`
	User       string `json:"user"        mapstructure:"user"`
	Password   string `json:"password"    mapstructure:"password"`
	Host       string `json:"host"        mapstructure:"host"`
	SSLMode    string `json:"ssl_mode"    mapstructure:"ssl_mode"`
	Port       string `json:"port"        mapstructure:"port"`
	Name       string `json:"name"        mapstructure:"name"`        // database name
	DisableLog bool   `json:"disable_log" mapstructure:"disable_log"` // disable log
	Alias      string `json:"alias"       mapstructure:"alias"`       // default set Name value
	Default    bool   `json:"default"     mapstructure:"default"`     // set default
}

// RegisterDatabase register database
func RegisterDatabase(drivers ...Driver) {
	for _, driver := range drivers {
		db := &gorm.DB{}
		var err error

		switch driver.Driver {
		case "postgres":
			db, err = gorm.Open("postgres", fmt.Sprintf("postgres://%v:%v@%v/%v?sslmode=disable", driver.User, driver.Password, driver.Host, driver.Name))
		default:
			db, err = gorm.Open("mysql", fmt.Sprintf("%v:%v@tcp(%v:%v)/%v?charset=utf8mb4&parseTime=True&loc=Local&multiStatements=true", driver.User, driver.Password, driver.Host, driver.Port, driver.Name))
		}

		if err != nil {
			panic(err)
		}

		if !driver.DisableLog {
			db.LogMode(true)
		}

		if len(driver.Alias) == 0 {
			driver.Alias = driver.Name
		}

		databaseCacheMux.Lock()

		if len(databaseCache) == 0 || driver.Default {
			databaseCache[defaultDatabaseKey] = db
		}
		databaseCache[driver.Alias] = db

		databaseCacheMux.Unlock()
	}
}

// GetWithAlias return DB from database cache with alias
func GetWithAlias(alias string, xReqID ...string) *gorm.DB {
	var reqID string

	if len(xReqID) > 0 {
		reqID = xReqID[0]
	} else {
		reqID = GenReqID()
	}

	db := databaseCache[alias].New()
	db.SetLogger(Logger{log.New(os.Stdout, "", 0), reqID})
	return db
}

// Get default database or use logger with xReqID
func Get(xReqID ...string) *gorm.DB {
	return GetWithAlias(defaultDatabaseKey, xReqID...)
}
