import { observable, action } from "mobx"
import AgoraRTM from "agora-rtm-sdk"

import { IRTN } from "models"

export class RTM {

  @observable
  info?: IRTN

  @observable
  client: any

  @observable
  channel: any

  @action
  async init(info: IRTN) {
    this.client = AgoraRTM.createInstance(info.app_id)
    await this.client.login(info.uid, info.rtm_token)
    this.channel = this.client.createChannel(info.channel)
    await this.channel.join()
  }

  @action
  sendMessage(text: string): Promise<void> {
    return this.channel.sendMessage({ text })
  }

  @action
  async leave() {
    await this.channel.leave()
    await this.client.logout()
  }
}
