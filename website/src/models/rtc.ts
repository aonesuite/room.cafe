import { observable, action } from "mobx"
import AgoraRTC, { IAgoraRTCClient, UID, IMicrophoneAudioTrack, ICameraVideoTrack, IAgoraRTCRemoteUser, VideoEncoderConfigurationPreset } from "agora-rtc-sdk-ng"

import { Stream, IRTN } from "models"

export class RTC {

  @observable info?: IRTN

  @observable client: IAgoraRTCClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

  @observable screenClient?: IAgoraRTCClient

  @observable localVideoTrackClarity: VideoEncoderConfigurationPreset = "480p_9"

  @observable isFullscreen: boolean = false

  @observable localStream: Stream = new Stream()

  @observable localScreenStream?: Stream

  @observable streams = observable.array<Stream>([], { deep: true })

  @action
  addRemoteUser(user: IAgoraRTCRemoteUser) {
    if (this.streams.findIndex(item => item.uid === user.uid) < 0) {
      const stream = new Stream()
      stream.updateWithRTCRemoteUser(user)
      this.streams.push(stream)
    }
  }

  @action
  async init(rtn: IRTN) {
    this.info = rtn;

    [
      this.localStream.uid,
      this.localStream.audioTrack,
      this.localStream.videoTrack
    ] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
      this.client.join(rtn.app_id, rtn.channel, rtn.rtc_token, rtn.uid),            // join the channel
      AgoraRTC.createMicrophoneAudioTrack(),                                        // create local tracks, using microphone
      AgoraRTC.createCameraVideoTrack({encoderConfig: this.localVideoTrackClarity}) // create local tracks, using camera
    ])

    // 发布本地音视频
    this.client.publish([this.localStream.audioTrack, this.localStream.videoTrack])

    this.localStream.audioMuted = this.localStream.videoTrack.isMuted
    this.localStream.videoMuted = this.localStream.audioTrack.isMuted
    this.localStream.isLocal = true

    // 用户加入频道
    this.client.on("user-joined", (user: IAgoraRTCRemoteUser) => {
      this.addRemoteUser(user)
    })

    // 用户离开频道
    this.client.on("user-left", (user: IAgoraRTCRemoteUser, reason: string) => {
      const _u = this.streams.find(item => item.uid === user.uid)
      if (_u) { this.streams.remove(_u) }
    })

    // 订阅远端音视频
    this.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "all") => {

      // user-published 与 user-joined 不能保证顺序
      this.addRemoteUser(user)

      await this.client.subscribe(user)

      const u = this.streams.find(item => item.uid === user.uid)

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
      const u = this.streams.find(item => item.uid === user.uid)
      if (u === undefined) { return }
      u.audioMuted = user.audioMuted
      u.videoMuted = user.videoMuted
    })
  }

  @action
  async shareScreen() {
    if (this.info === undefined) return

    this.screenClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

    await this.screenClient.join(this.info.app_id, this.info.channel, this.info.screen_rtc_token, this.info.screen_uid);

    this.localScreenStream = new Stream();

    [
      this.localScreenStream.videoTrack,
      this.localScreenStream.audioTrack
    ] = await AgoraRTC.createScreenVideoTrack({ encoderConfig: "1080p_1" }, true)

    // 发布本地音视频
    await this.client.publish([this.localScreenStream.audioTrack, this.localScreenStream.videoTrack])

    this.localScreenStream.audioMuted = this.localScreenStream.videoTrack.isMuted
    this.localScreenStream.videoMuted = this.localScreenStream.audioTrack.isMuted
    this.localScreenStream.isLocal = true
  }

  @action
  setLocalVideoTrackClarity(clarity: VideoEncoderConfigurationPreset) {
    this.localVideoTrackClarity = clarity
    const localVideoTrack = this.localStream.videoTrack as ICameraVideoTrack
    if (localVideoTrack) {
      localVideoTrack.setEncoderConfiguration(clarity as VideoEncoderConfigurationPreset)
    }
  }

  @action
  setLocalTrackMute(kind: "audio" | "video", muted: boolean) {
    this.localStream.muteTrack(kind, muted)
  }

  @action
  async leave() {
    this.localStream.release()

    if (this.client) {
      await this.client.leave()
    }
  }
}
