// Package white whiteboard provider
// 开发文档： https://developer.herewhite.com/
// 开发者控制台： https://console.herewhite.com/
package white

import (
	"fmt"
	"net/http"
	"time"

	"room.cafe/components/log"
	"room.cafe/components/rpc"
)

// Client herewhite client
type Client struct {
	miniToken string
	host      string
	client    *rpc.Client
}

// NewClient 新建一个白板客户端
func NewClient(miniToken, host string) *Client {
	return &Client{
		miniToken: miniToken,
		host:      host,
		client:    &rpc.Client{Client: http.DefaultClient},
	}
}

// ReqCreateWhite 创建白板的参数
type ReqCreateWhite struct {
	Name  string `json:"name"`
	Limit int    `json:"limit"`
}

// WhiteReturnCode 返回 code
type WhiteReturnCode struct {
	Code int `json:"code"`
}

// Info 白板信息
type Info struct {
	UUID      string    `json:"uuid"`
	Name      string    `json:"name"`
	Limit     int       `json:"limit"`
	TeamID    string    `json:"teamId"`
	AdminID   int       `json:"adminId"`
	Mode      string    `json:"mode"`
	Template  string    `json:"template"`
	Region    string    `json:"region"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// CreateWhiteResp 创建白板返回值
type CreateWhiteResp struct {
	Room      Info   `json:"room"`
	RoomToken string `json:"roomToken"`
}

// CreateWhite 创建白板
func (wc *Client) CreateWhite(l *log.Logger, req ReqCreateWhite) (res CreateWhiteResp, err error) {
	var (
		resp struct {
			WhiteReturnCode
			Msg CreateWhiteResp `json:"msg"`
		}
	)

	err = wc.client.CallWithJSON(l, &resp, fmt.Sprintf("%s/room?token=%s", wc.host, wc.miniToken), &req)
	if err != nil || resp.WhiteReturnCode.Code != 200 {
		err = fmt.Errorf("err: %s, code: %d", err.Error(), resp.WhiteReturnCode.Code)
		return
	}

	res = resp.Msg
	return
}

// GetWhite 获取白板信息
func (wc *Client) GetWhite(l *log.Logger, uuid string) (res Info, err error) {
	var (
		resp struct {
			WhiteReturnCode
			Msg Info `json:"msg"`
		}
	)

	err = wc.client.GetCall(l, &resp, fmt.Sprintf("%s/room/id?uuid=%s&token=%s", wc.host, uuid, wc.miniToken))
	if err != nil || resp.WhiteReturnCode.Code != 200 {
		err = fmt.Errorf("err: %s, code: %d", err.Error(), resp.WhiteReturnCode.Code)
		return
	}

	res = resp.Msg
	return
}

// DeleteWhite 删除房间
func (wc *Client) DeleteWhite(l *log.Logger, uuid string) (err error) {
	resp := WhiteReturnCode{}
	err = wc.client.CallWithJSON(l, &resp, fmt.Sprintf("%s/room/close?token=%s", wc.host, wc.miniToken), map[string]string{"uuid": uuid})
	if err != nil || resp.Code != 200 {
		err = fmt.Errorf("err: %s, code: %d", err.Error(), resp.Code)
	}
	return
}

// RoomToken 加入房间需要用到的token
type RoomToken struct {
	RoomToken string `json:"roomToken"`
}

// GetRoomToken 获取加入房间需要用到的token
func (wc *Client) GetRoomToken(l *log.Logger, uuid string) (token string, err error) {
	var resp struct {
		WhiteReturnCode
		Msg RoomToken `json:"msg"`
	}

	u := fmt.Sprintf("%s/room/join?uuid=%s&token=%s", wc.host, uuid, wc.miniToken)
	err = wc.client.Call(l, &resp, u)
	if err != nil || resp.Code != 200 {
		err = fmt.Errorf("resp code: %v", resp.Code)
		return
	}

	token = resp.Msg.RoomToken
	return
}
