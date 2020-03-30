import React, { useState, useEffect, useCallback } from "react"
import AgoraRTC, { IMicrophoneAudioTrack, ICameraVideoTrack, UID } from "agora-rtc-sdk-ng"

import { IRTCArgs, IRTC } from "models"

import { Monitor } from "./monitor"

const initRTCState: IRTC = {}

export default function RTC(params: IRTCArgs) {

  const [rtc, setRTC] = useState(initRTCState)

  // 初始化 RTC client
  const initRTC = useCallback(
    async () => {
      console.log("init rtc", params)

      const client = AgoraRTC.createClient({mode: "live", codec: "vp8"})

      const [uid, localAudioTrack, localVideoTrack] = await Promise.all<UID, IMicrophoneAudioTrack, ICameraVideoTrack>([
        client.join(params.rtc_app_id, params.rtc_channel, null), // join the channel
        AgoraRTC.createMicrophoneAudioTrack(), // create local tracks, using microphone
        AgoraRTC.createCameraVideoTrack()      // create local tracks, using camera
      ])

      setRTC({client, uid, localAudioTrack, localVideoTrack})

      localVideoTrack.play("local-player")

      // 将这些音视频轨道对象发布到频道中
      await client.publish([localAudioTrack, localVideoTrack])
    },
    [params]
  )

  useEffect(() => {
    initRTC()
    return function cleanup() {
      rtc.client?.leave()
    }
  }, [initRTC])

  return (
    <div className="streams">
      { rtc.uid }

      {
        rtc.uid && <Monitor uid={rtc.uid} />
      }

      <div id="local-player" className="player" style={{ width: 480, height: 320 }}></div>
    </div>
  )
}
