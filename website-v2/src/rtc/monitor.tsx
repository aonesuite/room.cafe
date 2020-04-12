import React, { useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import className from "classnames"

import { User } from "models"
import AudioVolume from "./AudioVolume"
import { ReactComponent as MicrophoneSlashSVG } from "assets/icons/MicrophoneSlash.svg"

interface IMonitorOptions {
  user: User
}

const Monitor = observer((options: IMonitorOptions) => {

  const monitorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const monitorElement = monitorRef.current
    if (!monitorElement) return

    if (!options.user.videoTrack) return
    options.user.videoTrack.play(monitorElement)
  }, [options.user.videoTrack])

  return (
    <div ref={monitorRef} id={`monitor-${options.user.uid}`} className="monitor">
      <div className="info">
        { options.user.uid }

        <div className={className({ "audio-status": true, "mute": options.user.audioTrack?.getStats().muteState })}>
          { (options.user.audioTrack && !options.user.audioMuted) && <AudioVolume track={ options.user.audioTrack } /> }
          { (options.user.audioTrack && options.user.audioMuted) && <MicrophoneSlashSVG height={18} /> }
        </div>
      </div>
    </div>
  )
})

export default Monitor
