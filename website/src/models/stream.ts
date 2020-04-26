import { observable, action } from "mobx"
import {
  UID,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  ILocalTrack
} from "agora-rtc-sdk-ng"

import { IAttendee } from "models"

export class Stream {

  // 用于标识用户的 ID，同一频道中每个用户都具有唯一的 ID，且数据类型相同
  @observable uid?: UID

  // 用户 profile
  @observable attendee?: IAttendee

  // 音频轨道
  @observable audioTrack?: IMicrophoneAudioTrack | ILocalAudioTrack | IRemoteAudioTrack

  // 音频静音状态
  @observable audioMuted: boolean = false

  // 视频轨道
  @observable videoTrack?: ICameraVideoTrack | ILocalVideoTrack | IRemoteVideoTrack

  // 视频是否被 mute
  @observable videoMuted: boolean = false

  // 是否为本地 stream
  @observable isLocal: boolean = false

  // 使用远端用户更新 stream
  @action updateWithRTCRemoteUser(user: IAgoraRTCRemoteUser) {
    this.uid        = user.uid
    this.audioTrack = user.audioTrack
    this.videoTrack = user.videoTrack
    this.audioMuted = user.audioMuted
    this.videoMuted = user.videoMuted
  }

  // 静音
  @action muteTrack(kind: "audio" | "video", muted: boolean) {
    switch (kind) {
      case "audio":
        if (this.isLocal && this.audioTrack) {
          const localAudioTrack = this.audioTrack as IMicrophoneAudioTrack
          localAudioTrack.setMute(muted)
          this.audioMuted = localAudioTrack.isMuted
        }
        break
      case "video":
        if (this.isLocal && this.videoTrack) {
          const localVideoTrack = this.videoTrack as ICameraVideoTrack
          localVideoTrack.setMute(muted)
          this.videoMuted = localVideoTrack.isMuted
        }
        break
    }
  }

  // 释放流
  @action release() {
    this.audioTrack?.stop()
    this.videoTrack?.stop()

    const localAudioTrack = this.audioTrack as ILocalTrack
    if (localAudioTrack) {
      localAudioTrack.close()
    }

    const localVideoTrack = this.videoTrack as ILocalTrack
    if (localVideoTrack) {
      localVideoTrack.close()
    }

    this.audioTrack = undefined
    this.videoTrack = undefined
  }
}
