export interface IMsg {
  uid:        string
  timestamp?: number
  content:    string
}

export class ChatMessage {
  public uid:       string
  public timestamp: number
  public content:   string

  public constructor(msg: IMsg) {
    this.uid    = msg.uid
    this.timestamp = msg.timestamp || new Date().getTime()
    this.content   = msg.content
  }

  public customMessage(): string {
    return JSON.stringify({
      timestamp: this.timestamp,
      content:   this.content
    })
  }
}
