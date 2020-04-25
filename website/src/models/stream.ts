import { observable, action } from "mobx"
import {
  UID,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack
} from "agora-rtc-sdk-ng"

export class Stream {

  @observable
  uid?: UID

  @observable
  audioTrack?: IMicrophoneAudioTrack | IRemoteAudioTrack

  @observable
  videoTrack?: ICameraVideoTrack | IRemoteVideoTrack

  screenAudioTrack?: ILocalAudioTrack | IRemoteAudioTrack

  screenVideoTrack?: ILocalVideoTrack | IRemoteVideoTrack

  @observable
  audioMuted: boolean = false

  @observable
  videoMuted: boolean = false

  isLocal: boolean = false

  @action
  updateWithRTCRemoteUser(user: IAgoraRTCRemoteUser) {
    this.uid        = user.uid
    this.audioTrack = user.audioTrack
    this.videoTrack = user.videoTrack
    this.audioMuted = user.audioMuted
    this.videoMuted = user.videoMuted
  }
}
