import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"

import { useRoomStore } from "room/context"

import { Monitor } from "./monitor"

import "./monitor.scss"

const RTC = observer(() => {

  const { roomStore } = useRoomStore()

  useEffect(() => {

    console.log("rtc local tracks 2", roomStore.localTracks)

  }, [roomStore])

  return (
    <div className="streams">

      <div>{ roomStore.uuid }</div>

      <Monitor uid={roomStore.rtcUID || ""} tracks={ roomStore.localTracks } />

      {
        roomStore.rtcClient?.remoteUsers.length
      }

    </div>
  )
})

export default RTC
