import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
// import { useTranslation } from "react-i18next"

import { RoomAPI } from "../api/room"
import { IRoomInfo } from "../models"

import "./room.scss"

import WhiteBoard from "../whiteboard"

const initRoomInfo: IRoomInfo = { uuid: "" }

export default function Room() {
  // const { t } = useTranslation()
  const { uuid } = useParams()

  const [ roomInfo, setRoomInfo ] = useState(initRoomInfo)

  useEffect(() => {
    if (uuid === undefined) {
      return
    }

    RoomAPI.Info(uuid).then((info: IRoomInfo) => {
      setRoomInfo(info)
    })

  }, [uuid])

  return (
    <div className="room">

      {/* <Navbar /> */}

      {
        (roomInfo.whiteboard_id && roomInfo.whiteboard_token) &&
          <WhiteBoard uuid={roomInfo.whiteboard_id} roomToken={roomInfo.whiteboard_token} />
      }

      {/* <Streams v-if="RTC.roomState === 2" /> */}

      {/* <Chat v-if="RTC.roomState === 2" /> */}

      {/* <QuickStartModal @joinRoom="joinRoom" /> */}

      {/* <b-modal
        id="AllowDevices"
        ref="AllowDevices"
        centered
        :lazy="true"
        :no-close-on-backdrop="true"
        size="lg"
        hide-footer
        hide-header
        className="modal-allow-devices">
        <div className="hint-allow">
          <h5>{ t("devices_allow_hint_title") }</h5>
          <p>{ t("devices_allow_hint_desc") }</p>
        </div>
      </b-modal> */}
    </div>
  )
}
