package models

import (
	"components/timestamp"
)

// Room 房间
type Room struct {
	ID           uint                 `json:"id"            gorm:"primary_key"`
	Name         string               `json:"name"          gorm:"size:128"`
	Owner        uint                 `json:"owner"         gorm:"index"`
	Public       bool                 `json:"public"`
	RTNID        string               `json:"rtn_id"        gorm:"size:128;column:rtn_id"`
	WhiteboardID string               `json:"whiteboard_id" gorm:"size:128;column:whiteboard_id"`
	CreatedAt    timestamp.Timestamp  `json:"created_at"`
	UpdatedAt    timestamp.Timestamp  `json:"updated_at"`
	DeletedAt    *timestamp.Timestamp `json:"deleted_at,omitempty"`
}

// Attendee 会议出席者
type Attendee struct {
	UserID uint `json:"user_id" gorm:"unique_index:room_user"`
	RoomID uint `json:"room_id" gorm:"unique_index:room_user"`
}
