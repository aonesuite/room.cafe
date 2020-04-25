import React, { useState, useRef, useEffect } from "react"
import { observer } from "mobx-react-lite"
import className from "classnames"

import { Stream, IAttendee } from "models"
import AudioVolume from "./AudioVolume"
import { MicrophoneSlashSVG } from "assets/icons"

import { useRoomStore } from "room/context"

interface IMonitorOptions {
  stream: Stream
}

const Monitor = observer((options: IMonitorOptions) => {
  const { roomStore } = useRoomStore()
  const [attendee, setAttendee] = useState<IAttendee | undefined>(undefined)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const playerElement = playerRef.current
    if (!playerElement) return
    if (!options.stream.videoTrack) return
    options.stream.videoTrack.play(playerElement)
  }, [options.stream.videoTrack])

  useEffect(() => {
    setAttendee(roomStore.attendees?.find(item => item.uid === options.stream.uid))
  }, [options.stream.uid, roomStore.attendees])

  return (
    <div id={`monitor-${options.stream.uid}`} className="monitor">
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
          "video-mute": options.stream.videoTrack && options.stream.videoMuted,
          "audio-mute": options.stream.audioTrack && options.stream.audioMuted
        })}>
      </div>

      <div className="info">
        <span>{ attendee?.name }</span>
        <div className={className({ "audio-status": true, "mute": options.stream.audioTrack?.getStats().muteState })}>
          { (options.stream.audioTrack && !options.stream.audioMuted) && <AudioVolume track={ options.stream.audioTrack } /> }
          { (options.stream.audioTrack && options.stream.audioMuted) && <MicrophoneSlashSVG height={18} /> }
        </div>
      </div>
    </div>
  )
})

export default Monitor
