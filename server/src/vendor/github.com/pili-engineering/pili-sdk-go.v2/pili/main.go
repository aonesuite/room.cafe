package pili

import (
	"fmt"
	"net/http"
	"time"
)

// Client 代表一个 pili 用户的客户端.
type Client struct {
	*rpc
	mac *MAC
}

// New 初始化 Client.
func New(mac *MAC, tr http.RoundTripper) *Client {
	rpc := newRPC(newTransport(mac, tr))
	return &Client{
		rpc: rpc,
		mac: mac,
	}
}

// Hub 初始化一个 Hub.
func (c *Client) Hub(hub string) *Hub {

	return newHub(hub, c)
}

// RTMPPublishURL 生成 RTMP 推流地址.
// expireAfterSeconds 表示 URL 在多久之后失效.
func RTMPPublishURL(domain, hub, streamKey string, mac *MAC, expireAfterSeconds int64) string {
	expire := time.Now().Unix() + expireAfterSeconds
	path := fmt.Sprintf("/%s/%s?e=%d", hub, streamKey, expire)
	token := mac.Sign([]byte(path))
	return fmt.Sprintf("rtmp://%s%s&token=%s", domain, path, token)
}

// RTMPPlayURL 生成 RTMP 直播地址.
func RTMPPlayURL(domain, hub, streamKey string) string {
	return fmt.Sprintf("rtmp://%s/%v/%v", domain, hub, streamKey)
}

// HLSPlayURL 生成 HLS 直播地址.
func HLSPlayURL(domain, hub, streamKey string) string {
	return fmt.Sprintf("http://%s/%s/%s.m3u8", domain, hub, streamKey)
}

// HDLPlayURL 生成 HDL 直播地址.
func HDLPlayURL(domain, hub, streamKey string) string {
	return fmt.Sprintf("http://%s/%s/%s.flv", domain, hub, streamKey)
}

// SnapshotPlayURL 生成直播封面地址.
func SnapshotPlayURL(domain, hub, streamKey string) string {
	return fmt.Sprintf("http://%s/%s/%s.jpg", domain, hub, streamKey)
}
