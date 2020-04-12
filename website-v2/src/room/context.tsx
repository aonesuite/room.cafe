import React from "react"
import { observable, action } from "mobx"
import AgoraRTC, { IAgoraRTCClient, UID, IMicrophoneAudioTrack, ICameraVideoTrack, IAgoraRTCRemoteUser, VideoEncoderConfigurationPreset } from "agora-rtc-sdk-ng"

import { RoomAPI } from "api/room"
import { IRoomInfo, User } from "models"

export class RoomStore {
  @observable
  uuid?: string

  @observable
  info?: IRoomInfo

  @observable
  client: IAgoraRTCClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

  @observable
  localVideoTrackClarity: VideoEncoderConfigurationPreset = "480p_9"

  @observable
  isFullscreen: boolean = false

  @observable
  localUser: User = new User()

  @observable
  users = observable.array<User>([], { deep: true })

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
      const remoteUser = new User()
      remoteUser.updateWithRTCRemoteUser(user)
      this.users.push(remoteUser)
    }
  }

  @action
  async initRTC(info: IRoomInfo) {

    [
      this.localUser.uid,
      this.localUser.audioTrack,
      this.localUser.videoTrack
    ] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
      this.client.join(info.rtc_app_id || "", info.rtc_channel || "", null),        // join the channel
      AgoraRTC.createMicrophoneAudioTrack(),                                        // create local tracks, using microphone
      AgoraRTC.createCameraVideoTrack({encoderConfig: this.localVideoTrackClarity}) // create local tracks, using camera
    ])

    // 发布本地音视频
    this.client.publish([this.localUser.audioTrack, this.localUser.videoTrack])

    this.localUser.audioMuted = this.localUser.videoTrack.isMuted
    this.localUser.videoMuted = this.localUser.audioTrack.isMuted
    this.localUser.isLocalUser = true

    // this.users.push(localUser)

    // 用户加入频道
    this.client.on("user-joined", (user: IAgoraRTCRemoteUser) => {
      this.addUser(user)
    })

    // 用户离开频道
    this.client.on("user-left", (user: IAgoraRTCRemoteUser, reason: string) => {
      const _u = this.users.find(item => item.uid === user.uid)
      if (_u) { this.users.remove(_u) }
    })

    // 订阅远端音视频
    this.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "all") => {

      // user-published 与 user-joined 不能保证顺序
      this.addUser(user)

      await this.client.subscribe(user)

      const u = this.users.find(item => item.uid === user.uid)

      if (u === undefined) { return }

      if (["all", "video"].includes(mediaType) && user.videoTrack !== undefined) {
        u.videoTrack = user.videoTrack
        u.videoMuted = user.videoMuted
      }

      if (["all", "audio"].includes(mediaType) && user.audioTrack !== undefined) {
        u.audioTrack = user.audioTrack
        u.audioMuted = user.audioMuted
        u.audioTrack.play()
      }
    })

    // 远程用户更新静音状态
    this.client.on("user-mute-updated", (user: IAgoraRTCRemoteUser) => {
      const u = this.users.find(item => item.uid === user.uid)
      if (u === undefined) { return }
      u.audioMuted = user.audioMuted
      u.videoMuted = user.videoMuted
    })
  }

  @action
  setLocalVideoTrackClarity(clarity: VideoEncoderConfigurationPreset) {
    this.localVideoTrackClarity = clarity
    const localVideoTrack = this.localUser.videoTrack as ICameraVideoTrack
    if (localVideoTrack) {
      localVideoTrack.setEncoderConfiguration(clarity as VideoEncoderConfigurationPreset)
    }
  }

  @action
  setLocalTrackMute(kind: "audio" | "video", muted: boolean) {
    switch (kind) {
      case "audio":
        const localAudioTrack = this.localUser.audioTrack as IMicrophoneAudioTrack
        if (localAudioTrack) {
          localAudioTrack.setMute(muted)
          this.localUser.audioMuted = localAudioTrack.isMuted
        }
        break
      case "video":
        const localVideoTrack = this.localUser.videoTrack as ICameraVideoTrack
        if (localVideoTrack) {
          localVideoTrack.setMute(muted)
          this.localUser.videoMuted = localVideoTrack.isMuted
        }
        break
    }
  }

  @action
  async leave() {

    const localVideoTrack = this.localUser.videoTrack as ICameraVideoTrack
    if (localVideoTrack) {
      localVideoTrack.stop()
      localVideoTrack.close()
    }

    const localAudioTrack = this.localUser.audioTrack as IMicrophoneAudioTrack
    if (localAudioTrack) {
      localAudioTrack.stop()
      localAudioTrack.close()
    }

    await this.client.leave()
  }
}

export const roomContext = React.createContext({
  roomStore: new RoomStore()
})

export const useRoomStore = () => React.useContext(roomContext)
