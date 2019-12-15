package db

import (
	"database/sql/driver"
	"encoding/json"
)

// H is map[string]interface{} abbr
type H map[string]interface{}

// Array MySQL json/array type
// usage eg.
// type User struct {
// 	ID   uint
// 	Name string
// 	Tags db.Array `gorm:"type:json"`
// }
type Array []interface{}

// Scan is custom overwrite func
func (a *Array) Scan(value interface{}) error {
	var array []interface{}
	err := json.Unmarshal(value.([]byte), &array)
	if err != nil {
		return err
	}
	*a = array
	return nil
}

// Value is custom overwrite func
func (a Array) Value() (driver.Value, error) {
	msg, err := json.Marshal(a)
	if err != nil {
		return nil, err
	}
	return string(msg), nil
}

// StringArray convert db Array to string array
func (a Array) StringArray() []string {
	new := make([]string, len(a))
	for i, v := range a {
		new[i] = v.(string)
	}
	return new
}

// UintArray convert db Array to uint array
func (a Array) UintArray() []uint {
	new := make([]uint, len(a))
	for k, v := range a {
		if ui, ok := v.(uint); ok {
			new[k] = ui
		} else {
			new[k] = uint(v.(float64))
		}
	}

	return new
}

// IntArray convert db array to int array
func (a Array) IntArray() []int {
	new := make([]int, len(a))
	for k, v := range a {
		if i, ok := v.(int); ok {
			new[k] = i
		} else {
			new[k] = int(v.(float64))
		}
	}

	return new
}

// StringArray string array to db Array
func StringArray(arr []string) Array {
	new := make([]interface{}, len(arr))
	for i, item := range arr {
		new[i] = item
	}
	return new
}

// IntArray int array to db array
func IntArray(array []int) Array {
	new := make([]interface{}, len(array))
	for i, item := range array {
		new[i] = item
	}
	return new
}

// --------------------------------------------------------------------

// Map MySQL json/map type
// usage eg.
// type User struct {
// 	ID   uint
// 	Name string
// 	Tags db.Map `gorm:"type:json"`
// }
type Map map[string]interface{}

// Scan is custom overwrite func
func (m *Map) Scan(value interface{}) error {
	var _map map[string]interface{}
	err := json.Unmarshal(value.([]byte), &_map)
	if err != nil {
		return err
	}
	*m = _map
	return nil
}

// Value is custom overwrite func
func (m Map) Value() (driver.Value, error) {
	msg, err := json.Marshal(m)
	if err != nil {
		return nil, err
	}
	return string(msg), nil
}

// StringMap convert map[string]string to db Map
func StringMap(old map[string]string) Map {
	var new map[string]interface{}
	for k, v := range old {
		new[k] = v
	}
	return new
}

// --------------------------------------------------------------------

// GetJSON return obj json string
func GetJSON(obj interface{}) interface{} {
	if obj == nil {
		return nil
	}
	if msg, err := json.Marshal(obj); err == nil {
		if str := string(msg); len(str) != 0 {
			return string(msg)
		}
	}
	return nil
}
