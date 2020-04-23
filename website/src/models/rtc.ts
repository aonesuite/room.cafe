import { observable, action } from "mobx"
import AgoraRTC, { IAgoraRTCClient, UID, IMicrophoneAudioTrack, ICameraVideoTrack, IAgoraRTCRemoteUser, VideoEncoderConfigurationPreset } from "agora-rtc-sdk-ng"

import { RTCUser, IRTN, RTM } from "models"

export class RTC {

  @observable
  info?: IRTN

  @observable
  rtcClient: IAgoraRTCClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

  @observable
  RTM: RTM = new RTM()

  @observable
  localVideoTrackClarity: VideoEncoderConfigurationPreset = "480p_9"

  @observable
  isFullscreen: boolean = false

  @observable
  localUser: RTCUser = new RTCUser()

  @observable
  users = observable.array<RTCUser>([], { deep: true })

  @action
  addUser(user: IAgoraRTCRemoteUser) {
    if (this.users.findIndex(item => item.uid === user.uid) < 0) {
      const remoteUser = new RTCUser()
      remoteUser.updateWithRTCRemoteUser(user)
      this.users.push(remoteUser)
    }
  }

  @action
  async init(rtn: IRTN) {

    [
      this.localUser.uid,
      this.localUser.audioTrack,
      this.localUser.videoTrack
    ] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
      this.rtcClient.join(rtn.app_id, rtn.channel, rtn.rtc_token, rtn.uid),         // join the channel
      AgoraRTC.createMicrophoneAudioTrack(),                                        // create local tracks, using microphone
      AgoraRTC.createCameraVideoTrack({encoderConfig: this.localVideoTrackClarity}) // create local tracks, using camera
    ])

    // 发布本地音视频
    this.rtcClient.publish([this.localUser.audioTrack, this.localUser.videoTrack])

    this.localUser.audioMuted = this.localUser.videoTrack.isMuted
    this.localUser.videoMuted = this.localUser.audioTrack.isMuted
    this.localUser.isLocalUser = true

    // 用户加入频道
    this.rtcClient.on("user-joined", (user: IAgoraRTCRemoteUser) => {
      this.addUser(user)
    })

    // 用户离开频道
    this.rtcClient.on("user-left", (user: IAgoraRTCRemoteUser, reason: string) => {
      const _u = this.users.find(item => item.uid === user.uid)
      if (_u) { this.users.remove(_u) }
    })

    // 订阅远端音视频
    this.rtcClient.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "all") => {

      // user-published 与 user-joined 不能保证顺序
      this.addUser(user)

      await this.rtcClient.subscribe(user)

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
    this.rtcClient.on("user-mute-updated", (user: IAgoraRTCRemoteUser) => {
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

    if (this.rtcClient) {
      await this.rtcClient.leave()
    }
  }
}
