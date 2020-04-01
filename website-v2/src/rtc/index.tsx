import React, { useEffect, useCallback } from "react"
import { observer } from "mobx-react-lite"

import { IRTCArgs } from "models"

import { useRoomStore } from "../room/context"

import { Monitor } from "./monitor"

const RTC = observer(() => {

  const { roomStore } = useRoomStore()

  // 初始化 RTC client
  const initRTC = useCallback(
    () => {

      console.log("localVideoTrack", roomStore.localVideoTrack)

      // 将这些音视频轨道对象发布到频道中
      // await client.publish([localAudioTrack, localVideoTrack])
    },
    [roomStore]
  )

  useEffect(() => {
    initRTC()
    return function cleanup() {
      // rtc.client?.leave()
    }
  }, [initRTC])

  return (
    <div className="streams">
      <div>
        { roomStore.uuid }
      </div>
      { roomStore.rtc?.uid }
      { roomStore.rtc?.uid && <Monitor uid={roomStore.rtc?.uid} /> }

      <div id="local-player" className="player" style={{ width: 480, height: 320 }}></div>
    </div>
  )
})

export default RTC