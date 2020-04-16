export interface IRoomArgs {
  name?:    string
  private?: boolean
}

export interface IRoomInfo {
  id:         number
  uuid:       string  // 房间对外的 UUID
  name:       string  // 自定义房间名称
  private:    boolean // 是否为私密房间
  state:      string  // 房间状态: active, archived
  owner:      number  // 管理员
  created_at: number
  updated_at: number
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
