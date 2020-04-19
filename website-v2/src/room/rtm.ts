import { observable, action } from "mobx"
import AgoraRTM from "agora-rtm-sdk"

import { IRTN, ChatMessage } from "models"

export enum EventName {
  ChannelMessage     = "ChannelMessage",
  MemberLeft         = "MemberLeft",
  MemberJoined       = "MemberJoined",
  AttributesUpdated  = "AttributesUpdated",
  MemberCountUpdated = "MemberCountUpdated"
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

    this.client = AgoraRTM.createInstance(info.app_id)

    await this.client.login({
      uid: `${info.uid}`,
      token: info.rtm_token
    })

    this.channel = this.client.createChannel(info.channel)

    await this.channel.join()

    this.channel.on('ChannelMessage', (message: any, memberId: any) => {
      console.log("rtm", message, memberId)
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
    await this.channel.leave()
    await this.client.logout()
  }
}
