package models

// Message IM
type Message struct {
	ID      uint   `json:"id" gorm:"primary_key"`
	UUID    string `json:"uuid"`
	RoomID  uint   `json:"room_id"`
	UserID  uint   `json:"user_id"`
	Content string `json:"content" gorm:"size:255"`
	Time    int64  `json:"time"`
}
