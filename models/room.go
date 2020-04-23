package models

import (
	"room.cafe/components/timestamp"
)

// Room 房间
type Room struct {
	ID           uint   `json:"id"       gorm:"primary_key"`
	UUID         string `json:"uuid"     gorm:"unique_index;size:24"` // 房间对外的 UUID
	Name         string `json:"name"     gorm:"size:128"`             // 自定义房间名称
	Private      bool   `json:"private"`                              // 是否为私密房间
	State        string `json:"state"`                                // 房间状态: active, archived
	Owner        uint   `json:"owner"    gorm:"index"`                // 管理员
	WhiteboardID string `json:"-"        gorm:"size:128"`             // 白板房间 ID

	CreatedAt timestamp.Timestamp  `json:"created_at"`
	UpdatedAt timestamp.Timestamp  `json:"updated_at"`
	DeletedAt *timestamp.Timestamp `json:"deleted_at,omitempty"`

	Attendees []Attendee `json:"attendees"` // 参会人员
	Self      Attendee   `json:"self"`      // 当前用户
}

// Role 角色
type Role string

const (
	// RoleAudience 普通观众
	RoleAudience Role = "audience"

	// RoleAdmin 房间管理员
	RoleAdmin Role = "admin"

	// RoleOwner 房间所有者
	RoleOwner Role = "owner"
)

// Attendee 会议出席者
type Attendee struct {
	ID     uint   `json:"id,omitempty"      gorm:"primary_key"`
	UserID uint   `json:"uid,omitempty"     gorm:"unique_index:room_user"`
	RoomID uint   `json:"room_id,omitempty" gorm:"unique_index:room_user"`
	Role   Role   `json:"role"`
	Name   string `json:"name"`
	Avatar string `json:"avatar"            sql:"-"`

	CreatedAt timestamp.Timestamp  `json:"created_at"`
	UpdatedAt timestamp.Timestamp  `json:"updated_at"`
	DeletedAt *timestamp.Timestamp `json:"deleted_at,omitempty"`
}

// --------------------------------------------------------------------

// RTN 房间
// https://docs.agora.io/cn/cloud-recording/token_server_go?platform=Go
type RTN struct {
	AppID          string `json:"app_id"`    // APP ID
	AppCertificate string `json:"-"`         // App 证书
	Channel        string `json:"channel"`   // 目标频/房间名称，保持跟 Room UUID 一致
	UID            uint32 `json:"uid"`       // 用户 ID
	RTCToken       string `json:"rtc_token"` // RTC RoomToken
	RTMToken       string `json:"rtm_token"` // RTM RoomToken
}

// --------------------------------------------------------------------

// Whiteboard 白板信息
type Whiteboard struct {
	WhiteboardID    string   `json:"whiteboard_id"`    // 白板房间 ID
	WhiteboardToken string   `json:"whiteboard_token"` // 白板房间 token
	User            Attendee `json:"user"`             // 当前用户
}
