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

    return function cleanup() {
      roomStore.leave()
    }
  }, [uuid, roomStore])

  return (
    <Layout>

      <Navbar />

      <Layout.Content>
        <div className="room">

        {
          // roomStore.info &&
          // <WhiteBoard uuid={roomStore.info.whiteboard_id} roomToken={roomStore.info.whiteboard_token} />
        }

        {
          roomStore.info && <RTC />
        }

        </div>
      </Layout.Content>
    </Layout>
  )
})

export default Room
