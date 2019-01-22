package pili

import (
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"time"
)

// StreamInfo 流信息.
type StreamInfo struct {
	Hub string
	Key string

	// 禁用结束的时间, 0 表示不禁用, -1 表示永久禁用.
	disabledTill int64

	// 实时转码规格
	Converts []string
}

// Disabled 判断一个流是否被禁用.
func (s *StreamInfo) Disabled() bool {
	return s.disabledTill == -1 || s.disabledTill > time.Now().Unix()
}

// String 返回格式化后的流信息
func (s *StreamInfo) String() string {
	return fmt.Sprintf("{hub:%s,key:%s,disabled:%v,converts:%v}", s.Hub, s.Key, s.Disabled(), s.Converts)
}

// Stream 表示一个流对象.
type Stream struct {
	hub     string
	key     string
	baseURL string
	client  *Client
}

func newStream(hub, key string, client *Client) *Stream {
	ekey := base64.URLEncoding.EncodeToString([]byte(key))
	baseURL := fmt.Sprintf("%s%s/v2/hubs/%v/streams/%v", APIHTTPScheme, APIHost, hub, ekey)
	return &Stream{hub, key, baseURL, client}
}

// Info 获得流信息.
func (s *Stream) Info() (info *StreamInfo, err error) {
	var ret struct {
		DisabledTill int64    `json:"disabledTill"`
		Converts     []string `json:"converts"`
	}
	err = s.client.Call(&ret, "GET", s.url())
	if err != nil {
		return
	}
	info = &StreamInfo{
		Hub:          s.hub,
		Key:          s.key,
		Converts:     ret.Converts,
		disabledTill: ret.DisabledTill,
	}
	return
}

func (s *Stream) url(p ...string) string {
	return joinPath(s.baseURL, p...)
}

type disabledArgs struct {
	DisabledTill int64 `json:"disabledTill"`
}

// Disable 永久禁用一个流.
func (s *Stream) Disable() error { return s.disableTill(-1) }

// DisableTill 在一定期限内禁止一个流.
// till Unix 时间戳, 在这之前流均不可用.
func (s *Stream) DisableTill(till int64) error { return s.disableTill(till) }

// Enable 启用一个流.
func (s *Stream) Enable() error { return s.disableTill(0) }

func (s *Stream) disableTill(till int64) error {
	args := &disabledArgs{till}
	return s.client.CallWithJSON(nil, "POST", s.url("disabled"), args)
}

// FPSStatus 帧率状态.
type FPSStatus struct {
	Audio int `json:"audio"`
	Video int `json:"video"`
	Data  int `json:"data"`
}

// LiveStatus 直播状态.
type LiveStatus struct {
	// 直播开始的 Unix 时间戳, 0 表示当前没在直播.
	StartAt int64 `json:"startAt"`

	// 直播的客户端 IP.
	ClientIP string `json:"clientIP"`

	// 直播的码率、帧率信息.
	BPS int       `json:"bps"`
	FPS FPSStatus `json:"fps"`
}

// ErrNoLive 标识流不在直播.
var ErrNoLive = errors.New("pili: no live")

// LiveStatus 查询直播状态, 如果不在直播返回ErrNoLive
func (s *Stream) LiveStatus() (status *LiveStatus, err error) {
	err = s.client.Call(&status, "GET", s.url("live"))
	if DetectErrorCode(err) == 619 {
		return nil, ErrNoLive
	}
	return
}

type saveArgs struct {
	Start int64 `json:"start"`
	End   int64 `json:"end"`
}

// SaveasOptions 保存回放的配置项.
type SaveasOptions struct {
	Fname    string `json:"fname,omitempty"`    // 保存的文件名, 不指定会随机生成.
	Start    int64  `json:"start,omitempty"`    // Unix 时间戳, 起始时间, 0 值表示不指定, 则不限制起始时间.
	End      int64  `json:"end,omitempty"`      // Unix 时间戳, 结束时间, 0 值表示当前时间.
	Format   string `json:"format,omitempty"`   // 保存的文件格式, 默认为m3u8.
	Pipeline string `json:"pipeline,omitempty"` // dora 的私有队列, 不指定则用默认队列.
	Notify   string `json:"notify,omitempty"`   // 保存成功后的回调地址.

	// 对应ts文件的过期时间.
	// -1 表示不修改ts文件的expire属性.
	// 0  表示修改ts文件生命周期为永久保存.
	// >0 表示修改ts文件的的生命周期为ExpireDays.
	ExpireDays int64 `json:"expireDays,omitempty"`
}

// ErrNoData 保存的回放时间点没有内容.
var ErrNoData = errors.New("pili: no data")

// Saveas 灵活度更高的保存直播回放, opts允许为nil.
// 如果没直播数据, 返回ErrNoData.
// fname 保存到bucket里的文件名.
func (s *Stream) Saveas(opts *SaveasOptions) (fname, persistentID string, err error) {
	if opts == nil {
		opts = new(SaveasOptions)
	}
	var ret struct {
		Fname        string `json:"fname"`
		PersistentID string `json:"persistentID"`
	}
	if err = s.client.CallWithJSON(&ret, "POST", s.url("saveas"), opts); err != nil {
		if DetectErrorCode(err) == 619 {
			err = ErrNoData
			return
		}
		return
	}
	return ret.Fname, ret.PersistentID, nil
}

// Save 保存直播回放.
// start Unix 时间戳, 起始时间, 0 值表示不指定, 则不限制起始时间.
// end Unix 时间戳, 结束时间, 0 值表示当前时间.
// fname 保存到bucket里的文件名, 由系统生成.
// persistentID 异步模式时，持久化异步处理任务ID，通常用不到该字段.
// 如果没直播数据, 返回ErrNoData.
func (s *Stream) Save(start, end int64) (fname string, err error) {
	fname, _, err = s.Saveas(&SaveasOptions{
		Start: start,
		End:   end,
	})
	return
}

// SnapshotOptions 保存直播截图的配置项.
type SnapshotOptions struct {
	Fname  string `json:"fname,omitempty"`  // 保存的文件名, 不指定会随机生成.
	Time   int64  `json:"time,omitempty"`   // Unix 时间戳, 保存的时间点, 默认为当前时间.
	Format string `json:"format,omitempty"` // 保存的文件格式, 默认为jpg.
}

// Snapshot 对流进行截图并保存，opts允许为nil.
// fname 保存在bucket里的文件名.
func (s *Stream) Snapshot(opts *SnapshotOptions) (fname string, err error) {
	if opts == nil {
		opts = new(SnapshotOptions)
	}
	var ret struct {
		Fname string `json:"fname"`
	}
	if err = s.client.CallWithJSON(&ret, "POST", s.url("snapshot"), opts); err != nil {
		return
	}
	return ret.Fname, nil
}

// UpdateConverts 更改流的实时转码规格
func (s *Stream) UpdateConverts(profiles []string) error {
	return s.client.CallWithJSON(nil, "POST", s.url("converts"), M{"converts": profiles})
}

// ActivityRecord 表示一次直播记录.
type ActivityRecord struct {
	Start int64 `json:"start"` // 直播开始时间
	End   int64 `json:"end"`   // 直播结束时间
}

// HistoryActivity 查询直播历史.
// start, end 是Unix 时间戳, 限定了查询的时间范围, 0 值表示不限定, 系统会返回所有时间的直播历史.
func (s *Stream) HistoryActivity(start, end int64) (records []ActivityRecord, err error) {
	path := appendQuery(s.url("historyactivity"), start, end)
	var ret struct {
		Items []ActivityRecord `json:"items"`
	}
	err = s.client.Call(&ret, "GET", path)
	if err != nil {
		return
	}
	records = ret.Items
	return
}

func appendQuery(path string, start, end int64) string {
	flag := "?"
	if start > 0 {
		path += flag + "start=" + strconv.FormatInt(start, 10)
		flag = "&"
	}
	if end > 0 {
		path += flag + "end=" + strconv.FormatInt(end, 10)
	}
	return path
}
