import React, { useEffect, useState } from "react"
import { UID, ILocalTrack, IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng"

import { useRoomStore } from "room/context"

export interface IMonitorOptions {
  uid: UID
  tracks: ILocalTrack[] | IRemoteVideoTrack[] | IRemoteAudioTrack[]
}

const initAudio: IRemoteAudioTrack | undefined = undefined

export function Monitor(options: IMonitorOptions) {

  const { roomStore } = useRoomStore()

  const [ audio, setAudio ] = useState(initAudio)

  useEffect(() => {

    console.log("monitor options", options)

    options.tracks.forEach((track: ILocalTrack | IRemoteVideoTrack | IRemoteAudioTrack) => {

      console.log("monitor track: ", track.trackMediaType, document.getElementById(`monitor-${options.uid}`))

      console.log("monitor audio track", roomStore.remoteAudioTracks.get(options.uid))

      const audio = roomStore.remoteAudioTracks.get(options.uid)
      audio?.play()

      setAudio(audio)

      if (track.trackMediaType === "video") {
        track.play(`monitor-${options.uid}`)
      }
    })

  },
  [options])

  return (
    <div id={`monitor-${options.uid}`} className="monitor">
      <div className="info">
        { options.uid }
        -
        {
          audio?.getTrackId()
        }
      </div>
    </div>
  )
}
