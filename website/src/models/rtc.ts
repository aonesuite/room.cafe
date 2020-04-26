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
  addStreamWithRemoteUser(user: IAgoraRTCRemoteUser) {
    if (this.streams.findIndex(item => item.uid === user.uid) < 0) {
      const stream = new Stream()
      stream.uid        = user.uid
      stream.audioTrack = user.audioTrack
      stream.videoTrack = user.videoTrack
      stream.audioMuted = user.audioMuted
      stream.videoMuted = user.videoMuted
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

    this.streams.push(this.localStream)

    // ----------------------------------------------------------------

    // 用户加入频道
    this.client.on("user-joined", (user: IAgoraRTCRemoteUser) => {
      this.addStreamWithRemoteUser(user)
    })

    // 用户离开频道
    this.client.on("user-left", (user: IAgoraRTCRemoteUser, reason: string) => {
      const stream = this.streams.find(item => item.uid === user.uid)
      if (stream) { this.streams.remove(stream) }
    })

    // 订阅远端音视频
    this.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "all") => {

      // user-published 与 user-joined 不能保证顺序
      this.addStreamWithRemoteUser(user)

      const uid = +user.uid
      if (this.info?.uid === 10000 - uid) return // 如果为当前用户，不订阅屏幕共享的 track

      await this.client.subscribe(user)

      const stream = this.streams.find(item => item.uid === user.uid)

      if (stream === undefined) { return }

      if (["all", "video"].includes(mediaType) && user.videoTrack !== undefined) {
        stream.videoTrack = user.videoTrack
        stream.videoMuted = user.videoMuted
      }

      if (["all", "audio"].includes(mediaType) && user.audioTrack !== undefined) {
        stream.audioTrack = user.audioTrack
        stream.audioMuted = user.audioMuted
      }
    })

    // 远程用户更新静音状态
    this.client.on("user-mute-updated", (user: IAgoraRTCRemoteUser) => {
      const stream = this.streams.find(item => item.uid === user.uid)
      if (stream === undefined) { return }
      stream.audioMuted = user.audioMuted
      stream.videoMuted = user.videoMuted
    })
  }

  @action
  async shareScreen() {
    if (this.info === undefined) return

    this.screenClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

    await this.screenClient.join(this.info.app_id, this.info.channel, this.info.screen_rtc_token, this.info.screen_uid)

    this.localScreenStream = new Stream();

    // 创建屏幕共享 track
    [
      this.localScreenStream.videoTrack,
      this.localScreenStream.audioTrack
    ] = await AgoraRTC.createScreenVideoTrack({ encoderConfig: "1080p_1" }, true)

    // 发布本地音视频
    await this.screenClient.publish([this.localScreenStream.audioTrack, this.localScreenStream.videoTrack])

    this.localScreenStream.audioMuted = this.localScreenStream.videoTrack.isMuted
    this.localScreenStream.videoMuted = this.localScreenStream.audioTrack.isMuted
    this.localScreenStream.isLocal = true

    this.streams.push(this.localScreenStream)
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
