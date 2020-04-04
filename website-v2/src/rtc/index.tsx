import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng"

import { useRoomStore } from "room/context"

import "./rtc.scss"

const RTC = observer(() => {

  const { roomStore } = useRoomStore()

  useEffect(() => {
    if (roomStore.localVideoTrack) { roomStore.localVideoTrack.play(`monitor-${roomStore.localVideoTrack.getUserId()}`) }
  }, [roomStore.localVideoTrack])

  useEffect(() => {
    if (roomStore.localAudioTrack) {
      console.log("localAudioTrack", roomStore.localAudioTrack)
    }
  }, [roomStore.localAudioTrack])

  useEffect(() => {
    roomStore.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video" | "all") => {

      await roomStore.client.subscribe(user)

      setTimeout(() => {
        if (["all", "video"].includes(mediaType) && user.videoTrack !== undefined) {
          user.videoTrack.play(`monitor-${user.uid}`)
        }

        if (["all", "audio"].includes(mediaType) && user.audioTrack !== undefined) {
          user.audioTrack.play()
        }
      }, 1000)
    })
  }, [roomStore])

  return (
    <div className="streams">
      {
        (roomStore.rtcUID !== "" && roomStore.rtcUID !== undefined) &&
        <div key={roomStore.rtcUID} id={`monitor-${roomStore.rtcUID}`} className="monitor">
          <div className="info">
            { roomStore.rtcUID }
          </div>
        </div>
      }

      {
        roomStore.users.map((user) =>
        <div key={user.uid} id={`monitor-${user.uid}`} className="monitor">
          <div className="info">
            { user.uid }
          </div>
        </div>
        )
      }
    </div>
  )
})

export default RTC
