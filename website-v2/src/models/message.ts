export interface IMsg {
  userId:    string
  timestamp?: number
  content:   string
}

export class ChatMessage {
  readonly type:    string = "im"
  public userId:    string
  public timestamp: number
  public content:   string

  public constructor(msg: IMsg) {
    this.userId    = msg.userId
    this.timestamp = msg.timestamp || new Date().getTime()
    this.content   = msg.content
  }

  public customMessage(): string {
    return JSON.stringify({
      type:      this.type,
      timestamp: this.timestamp,
      content:   this.content
    })
  }
}
