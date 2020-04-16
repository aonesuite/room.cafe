import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { Layout } from "antd"

import QuickStart from "quick-start"
import WhiteBoard from "whiteboard"
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

      <Layout className="room" id="room">

        <Navbar />

        <Layout.Content>
          {
            roomStore.whiteboard && <WhiteBoard uuid={roomStore.whiteboard?.whiteboard_id} roomToken={roomStore.whiteboard?.whiteboard_token} />
          }

          { roomStore.rtn && <RTC /> }
        </Layout.Content>
      </Layout>
    </React.Fragment>
  )
})

export default Room
