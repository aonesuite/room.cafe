import React from "react"
import { observable, action } from "mobx"
import AgoraRTC, {
  IAgoraRTCClient,
  UID,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
  VideoEncoderConfigurationPreset
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
  localAudioTrack?: IMicrophoneAudioTrack

  @observable
  localVideoTrack?: ICameraVideoTrack

  @observable
  localVideoTrackClarity: VideoEncoderConfigurationPreset = "480p_9"

  @observable
  localAudioMuted: boolean = false

  @observable
  localVideoMuted: boolean = false

  @observable
  isFullscreen: boolean = false

  @observable
  users = observable.array<IAgoraRTCRemoteUser>([])

  @observable
  chatPopUp: boolean = false

  @action
  async init(uuid?: string) {
    if (uuid !== undefined) {
      this.uuid = uuid
      this.info = await RoomAPI.Info(uuid)

      await this.initRTC(this.info)
    }
  }

  @action
  addUser(user: IAgoraRTCRemoteUser) {
    if (this.users.findIndex(item => item.uid === user.uid) < 0) {
      this.users.push(user)
    }
  }

  @action
  async initRTC(info: IRoomInfo) {
    [this.rtcUID, this.localAudioTrack, this.localVideoTrack] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
      this.client.join(info.rtc_app_id || "", info.rtc_channel || "", null),        // join the channel
      AgoraRTC.createMicrophoneAudioTrack(),                                        // create local tracks, using microphone
      AgoraRTC.createCameraVideoTrack({encoderConfig: this.localVideoTrackClarity}) // create local tracks, using camera
    ])

    // 发布本地音视频
    this.client.publish([this.localAudioTrack, this.localVideoTrack])

    this.localVideoMuted = this.localVideoTrack.isMuted
    this.localAudioMuted = this.localAudioTrack.isMuted

    // 用户加入频道
    this.client.on("user-joined", (user: IAgoraRTCRemoteUser) => {
      this.addUser(user)
    })

    // 用户离开频道
    this.client.on("user-left", (user: IAgoraRTCRemoteUser, reason: string) => {
      this.users.remove(user)
    })
  }

  @action
  setLocalVideoTrackClarity(clarity: VideoEncoderConfigurationPreset) {
    this.localVideoTrackClarity = clarity
    if (this.localVideoTrack) {
      (this.localVideoTrack as ICameraVideoTrack).setEncoderConfiguration(clarity as VideoEncoderConfigurationPreset)
    }
  }

  @action
  setLocalTrackMute(kind: "audio" | "video", muted: boolean) {
    switch (kind) {
      case "audio":
        if (this.localAudioTrack) {
          this.localAudioTrack.setMute(muted)
          this.localAudioMuted = this.localAudioTrack.isMuted
        }
        break
      case "video":
        if (this.localVideoTrack) {
          this.localVideoTrack.setMute(muted)
          this.localVideoMuted = this.localVideoTrack.isMuted
        }
        break
    }
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
