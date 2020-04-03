import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Layout } from "antd"

import QuickStart from "quick-start"
// import WhiteBoard from "whiteboard"
import RTC from "rtc"

import Navbar from "./navbar"

import { useGlobalStore } from "common/contexts/GlobalContext"
import { useRoomStore } from "./context"

import "./room.scss"

const Room = observer(() => {
  const { globalStore } = useGlobalStore()
  const { uuid } = useParams()
  const { roomStore } = useRoomStore()

  const [modalVisible, setModalVisible] = useState(false)

  // 未登录处理
  useEffect(() => {
    setModalVisible(globalStore.user?.signed_in === false)
  }, [globalStore.user])

  // 初始化 room store
  useEffect(() => {

    roomStore.init(uuid)

    return function cleanup() {
      roomStore.leave()
    }
  }, [uuid, roomStore])

  return (
    <React.Fragment>
      <QuickStart visible={modalVisible} onCancel={ () => setModalVisible(false) } />

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
    </React.Fragment>
  )
})

export default Room
