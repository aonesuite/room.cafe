import React from "react"
import { observer } from "mobx-react-lite"

import { useRoomStore } from "room/context"

import { Monitor } from "./monitor"

import "./monitor.scss"

const RTC = observer(() => {

  const { roomStore } = useRoomStore()

  // useEffect(() => {

  //   console.log("rtc local tracks 2", roomStore.localTracks)

  // }, [roomStore])

  return (
    <div className="streams">

      {
        (roomStore.rtcUID !== "" && roomStore.rtcUID !== undefined) &&
        <Monitor uid={roomStore.rtcUID} tracks={ roomStore.localTracks } />
      }

      {
        // console.log("rtc page", roomStore.remoteVideoTracks)
      }

      {
        roomStore.remoteVideoTracks.map((track) =>
        <Monitor key={track.getUserId()} uid={track.getUserId()} tracks={ [track] } />
        )
      }

    </div>
  )
})

export default RTC
