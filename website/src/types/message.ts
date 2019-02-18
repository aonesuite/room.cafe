import { RTCUser } from '@/types/user';
import { CustomMessage } from 'pili-rtc-web';

export interface Msg {
  userId: string;
  timestamp: number;
  content: string;
}

export class ChatMessage {
  readonly type: string = "im";
  public userId: string;
  public timestamp: number;
  public content: string;

  public user?: RTCUser;

  public constructor(msg: Msg) {
    this.userId    = msg.userId;
    this.timestamp = msg.timestamp || new Date().getTime();
    this.content   = msg.content;
  }

  public customMessage(): string {
    return JSON.stringify({
      type:      this.type,
      timestamp: this.timestamp,
      content:   this.content,
    })
  }
}
