package models

import (
	"room.cafe/components/timestamp"
)

// Room 房间
type Room struct {
	ID      uint   `json:"id"             gorm:"primary_key"`
	UUID    string `json:"uuid"           gorm:"unique_index;size:24"` // 房间对外的 UUID
	Name    string `json:"name"           gorm:"size:128"`             // 自定义房间名称
	Private bool   `json:"private"`                                    // 是否为私密房间
	State   string `json:"state"`                                      // 房间状态: active, archived
	Owner   uint   `json:"owner"          gorm:"index"`                // 管理员

	RTCAppID   string `json:"rtc_app_id"  gorm:"-"`        // RTC APP ID
	RTCChannel string `json:"rtc_channel" gorm:"size:128"` // RTC 目标频/房间名称，保持跟 UUID 一致
	RTCUser    uint32 `json:"rtc_user"    gorm:"-"`
	RTCToken   string `json:"rtc_token"   gorm:"-"` // RTC RoomToken
	RTMToken   string `json:"rtm_token"   gorm:"-"` // RTM RoomToken

	Whiteboard      string `json:"whiteboard_id"    gorm:"size:128"` // 白板房间 ID
	WhiteboardToken string `json:"whiteboard_token" gorm:"-"`        // 白板房间 token

	CreatedAt timestamp.Timestamp  `json:"created_at"`
	UpdatedAt timestamp.Timestamp  `json:"updated_at"`
	DeletedAt *timestamp.Timestamp `json:"deleted_at,omitempty"`

	Attendees []User `json:"attendees" gorm:"many2many:attendees"` // 参会人员
}

// Role 角色
type Role string

const (
	// RoleAudience 普通观众
	RoleAudience = "audience"

	// RoleAdmin 房间管理员
	RoleAdmin = "admin"

	// RoleOwner 房间所有者
	RoleOwner = "owner"
)

// Attendee 会议出席者
type Attendee struct {
	UserID uint `json:"user_id" gorm:"unique_index:room_user"`
	RoomID uint `json:"room_id" gorm:"unique_index:room_user"`
	Role   Role `json:"role"`

	*User `gorm:"-"`
}
