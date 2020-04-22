import React from "react"
import { observer } from "mobx-react-lite"

import { useRoomStore } from "room/context"
import Monitor from "./monitor"

import "./rtc.scss"

const RTC = observer(() => {

  const { roomStore } = useRoomStore()

  return (
    <div className="streams">
      { <Monitor key={roomStore.localUser.uid} user={roomStore.localUser} /> }
      { roomStore.users.map((user) => <Monitor key={user.uid} user={user} />) }
    </div>
  )
})

export default RTC
