import { observable, action } from "mobx"
import {
  UID,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser
} from "agora-rtc-sdk-ng"

export interface IOAuthSignInArgs {
  provider: string
  state:    string
  code?:    string
}

export interface IUserArgs {
  name:    string
  email:   string
  gender?: string
}

export interface IUser {
  id:        number
  name:      string
  email?:    string
  gender?:   string
  avatar?:   string
  signed_in: boolean
}

export class RTCUser {

  @observable
  uid?: UID

  @observable
  audioTrack?: IMicrophoneAudioTrack | IRemoteAudioTrack

  @observable
  videoTrack?: ICameraVideoTrack | IRemoteVideoTrack

  @observable
  audioMuted: boolean = false

  @observable
  videoMuted: boolean = false

  isLocalUser: boolean = false

  @action
  updateWithRTCRemoteUser(user: IAgoraRTCRemoteUser) {
    this.uid        = user.uid
    this.audioTrack = user.audioTrack
    this.videoTrack = user.videoTrack
    this.audioMuted = user.audioMuted
    this.videoMuted = user.videoMuted
  }
}
