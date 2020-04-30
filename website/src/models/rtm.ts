import { observable, action } from "mobx"
import AgoraRTM from "agora-rtm-sdk"

import { IRTN, ChatMessage } from "models"

export type IRtmMessage = IRtmTextMessage | IRtmRawMessage

export interface IRtmTextMessage {
  text: string

  messageType?: "TEXT"
  rawMessage?:  never
  description?: never
}

export interface IRtmRawMessage {
  rawMessage:   Uint8Array
  description?: string
  messageType?: "RAW"
  text?:        never
}

export interface IReceiveMessageProperties {
  serverReceivedTs: number
  isOfflineMessage: boolean
}

export enum EventName {
  ChannelMessage     = "ChannelMessage",
  MemberLeft         = "MemberLeft",
  MemberJoined       = "MemberJoined",
  AttributesUpdated  = "AttributesUpdated",
  MemberCountUpdated = "MemberCountUpdated"
}

const params = {
  enableLogUpload: true,
  logFilter: AgoraRTM.LOG_FILTER_WARNING
}

// 生产模式禁用所有日志输出
if (process.env.NODE_ENV === "production") {
  params.enableLogUpload = false
  params.logFilter = AgoraRTM.LOG_FILTER_OFF
}

export class RTM {

  @observable
  info?: IRTN

  @observable
  client: any

  @observable
  channel: any

  @observable
  chatMessages: ChatMessage[] = []

  @action
  async init(info: IRTN) {

    this.client = AgoraRTM.createInstance(info.app_id, params)

    await this.client.login({
      uid: `${info.uid}`,
      token: info.rtm_token
    })

    this.channel = this.client.createChannel(info.channel)

    await this.channel.join()

    this.channel.on(EventName.ChannelMessage, (message: IRtmMessage, memberId: string, messagePros: IReceiveMessageProperties) => {
      switch (message.messageType) {
        case "TEXT":
          const msg = new ChatMessage({
            content: message.text,
            uid: memberId,
            timestamp: messagePros.serverReceivedTs
          })

          this.chatMessages.push(msg)
          break

        case "RAW":

          break
      }
    })
  }

  @action
  sendMessage(message: ChatMessage): Promise<void> {
    return this.channel.sendMessage({
      text: message.content
    })
  }

  @action
  async leave() {
    if (this.channel) {
      await this.channel.leave()
    }
    if (this.client) {
      await this.client.logout()
    }
  }
}
