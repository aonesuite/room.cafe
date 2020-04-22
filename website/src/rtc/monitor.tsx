import React, { useState, useRef, useEffect } from "react"
import { observer } from "mobx-react-lite"
import className from "classnames"

import { User, IAttendee } from "models"
import AudioVolume from "./AudioVolume"
import { MicrophoneSlashSVG } from "assets/icons"

import { useRoomStore } from "room/context"

interface IMonitorOptions {
  user: User
}

const Monitor = observer((options: IMonitorOptions) => {
  const { roomStore } = useRoomStore()
  const [attendee, setAttendee] = useState<IAttendee | undefined>(undefined)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const playerElement = playerRef.current
    if (!playerElement) return
    if (!options.user.videoTrack) return
    options.user.videoTrack.play(playerElement)
  }, [options.user.videoTrack])

  useEffect(() => {
    setAttendee(roomStore.attendees?.find(item => item.uid === options.user.uid))
  }, [options.user.uid, roomStore.attendees])

  return (
    <div id={`monitor-${options.user.uid}`} className="monitor">
      <svg role="img" viewBox="0 0 16 9" xmlns="http://www.w3.org/2000/svg"></svg>

      <div className="cover">
        {
          attendee && attendee?.avatar &&
          <img className="avatar" src={attendee?.avatar} alt={attendee?.name} />
        }
      </div>

      <div
        ref={playerRef}
        className={className({
          "player": true,
          "video-mute": options.user.videoTrack && options.user.videoMuted,
          "audio-mute": options.user.audioTrack && options.user.audioMuted
        })}>
      </div>

      <div className="info">
        <span>{ attendee?.name }</span>
        <div className={className({ "audio-status": true, "mute": options.user.audioTrack?.getStats().muteState })}>
          { (options.user.audioTrack && !options.user.audioMuted) && <AudioVolume track={ options.user.audioTrack } /> }
          { (options.user.audioTrack && options.user.audioMuted) && <MicrophoneSlashSVG height={18} /> }
        </div>
      </div>
    </div>
  )
})

export default Monitor
