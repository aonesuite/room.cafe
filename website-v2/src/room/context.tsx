import React from "react"
import { observable, action } from "mobx"
import AgoraRTC, {
  IAgoraRTCClient,
  UID,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser
} from "agora-rtc-sdk-ng"

import { RoomAPI } from "api/room"
import { IRoomInfo } from "models"

export class RoomStore {
  @observable
  uuid?: string

  @observable
  info?: IRoomInfo

  @observable
  client: IAgoraRTCClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

  @observable
  rtcUID?: UID

  @observable
  localAudioTrack?: ILocalAudioTrack

  @observable
  localVideoTrack?: ILocalVideoTrack

  @observable
  users = observable.array<IAgoraRTCRemoteUser>([])

  @action
  async init(uuid?: string) {
    if (uuid !== undefined) {
      this.uuid = uuid
      this.info = await RoomAPI.Info(uuid)

      await this.initRTC(this.info)
    }
  }

  @action
  async initRTC(info: IRoomInfo) {
    [this.rtcUID, this.localAudioTrack, this.localVideoTrack] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
      this.client.join(info.rtc_app_id || "", info.rtc_channel || "", null), // join the channel
      AgoraRTC.createMicrophoneAudioTrack(),                                 // create local tracks, using microphone
      AgoraRTC.createCameraVideoTrack()                                      // create local tracks, using camera
    ])

    // 发布本地音视频
    this.client.publish([this.localAudioTrack, this.localVideoTrack])

    // 用户加入频道
    this.client.on("user-joined", (user: IAgoraRTCRemoteUser) => {
      this.users.push(user)
    })

    // 用户离开频道
    this.client.on("user-left", (user: IAgoraRTCRemoteUser, reason: string) => {
      this.users.remove(user)
    })
  }

  @action
  async leave() {

    if (this.localVideoTrack) {
      this.localVideoTrack.stop()
      this.localVideoTrack.close()
      this.localVideoTrack = undefined
    }

    if (this.localAudioTrack) {
      this.localAudioTrack.stop()
      this.localAudioTrack.close()
      this.localAudioTrack = undefined
    }

    await this.client.leave()
  }
}

export const roomContext = React.createContext({
  roomStore: new RoomStore()
})

export const useRoomStore = () => React.useContext(roomContext)
