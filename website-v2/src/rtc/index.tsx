import React, { useState, useEffect, useCallback } from "react"
import AgoraRTC, { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng"

import { IRTCArgs, IRTC } from "models"

const initRTCState: IRTC = {
  client: AgoraRTC.createClient({ mode: "live", codec: "vp8" })
}

export default function RTC(params: IRTCArgs) {

  const [rtc] = useState(initRTCState)

  // 初始化 RTC client
  const initRTC = useCallback(
    async () => {
      console.log("init rtc")

      rtc.client.join(params.rtc_app_id, params.rtc_channel, params.rtc_token)

      const [ localAudioTrack,   localVideoTrack] = await Promise.all<IMicrophoneAudioTrack, ICameraVideoTrack>(
        [AgoraRTC.createMicrophoneAudioTrack(), AgoraRTC.createCameraVideoTrack()
      ])

      console.log(localAudioTrack, localVideoTrack)

      // 通过采集麦克/风创建本地音频轨道对象
      rtc.localAudioTrack = localAudioTrack

      // 通过采集摄像头创建本地视频轨道对象
      rtc.localVideoTrack = localVideoTrack

      // 将这些音视频轨道对象发布到频道中
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack])

      console.log("publish success!")
    },
    [params, rtc]
  )

  useEffect(() => {
    initRTC()
  }, [initRTC])

  return (
    <div className="streams"></div>
  )
}
