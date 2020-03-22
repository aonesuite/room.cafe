
export interface IRoomArgs {
  name?:    string
  private?: boolean
}

export interface IRoomInfo {
  id?:               number
  uuid:              string
  name?:             string
  private?:          boolean
  state?:            string
  owner?:            number
  rtc_token?:        string
  whiteboard_id?:    string
  whiteboard_token?: string
  created_at?:       number
  updated_at?:       number
}
