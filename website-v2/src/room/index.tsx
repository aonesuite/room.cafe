import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Layout } from "antd"

import Navbar from "./navbar"

// import WhiteBoard from "whiteboard"
import RTC from "rtc"

import { useRoomStore } from "./context"

import "./room.scss"

const Room = observer(() => {
  const { uuid } = useParams()
  const { roomStore } = useRoomStore()

  useEffect(() => {

    roomStore.init(uuid)

  }, [uuid, roomStore])

  return (
    <Layout>

      <Navbar />

      <Layout.Content>
        <div className="room">

        {
          // (roomInfo.whiteboard_id && roomInfo.whiteboard_token) &&
          //   <WhiteBoard uuid={roomInfo.whiteboard_id} roomToken={roomInfo.whiteboard_token} />
        }

        {
          (roomStore.info?.rtc_app_id && roomStore.info?.rtc_channel && roomStore.info?.rtc_token) &&
          <RTC />
        }

        </div>
      </Layout.Content>
    </Layout>
  )
})

export default Room
