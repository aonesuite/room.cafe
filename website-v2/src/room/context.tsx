import React from "react"
import { observable, action } from "mobx"

import AgoraRTC, { IMicrophoneAudioTrack, ICameraVideoTrack, UID } from "agora-rtc-sdk-ng"

import { RoomAPI } from "api/room"
import { IRoomInfo, IRTC } from "models"

export class RoomStore {
  @observable
  uuid?: string = ""

  @observable
  info?: IRoomInfo

  @observable
  rtc?: IRTC

  @observable
  localAudioTrack?: IMicrophoneAudioTrack

  @observable
  localVideoTrack?: ICameraVideoTrack

  @action
  async init(uuid?: string) {
    if (uuid !== undefined) {
      this.uuid = uuid
      this.info = await RoomAPI.Info(uuid)

      const client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"})

      const [uid, localAudioTrack, localVideoTrack] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
        client.join(this.info?.rtc_app_id || "", this.info?.rtc_channel || "", null), // join the channel
        AgoraRTC.createMicrophoneAudioTrack(), // create local tracks, using microphone
        AgoraRTC.createCameraVideoTrack()      // create local tracks, using camera
      ])

      console.log("room context", localAudioTrack, localVideoTrack)

      this.localAudioTrack = localAudioTrack
      this.localVideoTrack = localVideoTrack

      this.localVideoTrack.play("local-player")

      this.rtc = { client, uid, localAudioTrack, localVideoTrack }
    }
  }

}

export const roomContext = React.createContext({
  roomStore: new RoomStore()
})

export const useRoomStore = () => React.useContext(roomContext)
