import React from "react"
import { observer } from "mobx-react-lite"

import { useRoomStore } from "room/context"
import Monitor from "./monitor"

import "./rtc.scss"

const RTC = observer(() => {

  const { roomStore } = useRoomStore()

  return (
    <div className="streams">
      { roomStore.RTC.streams.map((stream) => <Monitor key={stream.uid} stream={stream} />) }
    </div>
  )
})

export default RTC
