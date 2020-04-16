export interface IRoomArgs {
  name?:    string
  private?: boolean
}

export interface IRoomInfo {
  id:               number
  uuid:             string
  name:             string
  private:          boolean
  state:            string
  owner:            number

  rtc_app_id:       string
  rtc_channel:      string
  rtc_user:         number
  rtc_token:        string
  rtm_token:        string

  whiteboard_id:    string
  whiteboard_token: string

  created_at:       number
  updated_at:       number
}

export interface IRTN {
  app_id:    string // APP ID
	channel:   string // 目标频/房间名称，保持跟 Room UUID 一致
	uid:       number // 用户 ID
	rtc_token: string // RTC RoomToken
	rtm_token: string // RTM RoomToken
}

export interface IWhiteboard {
	whiteboard_id:    string // 白板房间 ID
	whiteboard_token: string // 白板房间 token
}
