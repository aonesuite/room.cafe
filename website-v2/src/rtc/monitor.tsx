import React, { useEffect } from "react"
import { UID, ILocalTrack } from "agora-rtc-sdk-ng"

export interface IMonitorOptions {
  uid: UID
  tracks: ILocalTrack[]
}

export function Monitor(options: IMonitorOptions) {

  useEffect(() => {

    options.tracks.forEach((track) => {

      console.log("monitor track: ", track.trackMediaType, document.getElementById(`monitor-${options.uid}`))

      if (track.trackMediaType === "video") {
        track.play(`monitor-${options.uid}`)
      }
    })

  },
  [options])

  return (
    <div id={`monitor-${options.uid}`} className="monitor"></div>
  )
}
