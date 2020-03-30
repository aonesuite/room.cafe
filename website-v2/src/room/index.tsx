import React, { useState, useEffect } from "react"
import { useParams, NavLink } from "react-router-dom"
// import { useTranslation } from "react-i18next"
import { Layout, Row, Col } from "antd"

import { RoomAPI } from "api/room"
import { IRoomInfo } from "models"

// import WhiteBoard from "whiteboard"
import RTC from "rtc"

import { ReactComponent as LogoSVG } from "assets/icons/Logo.svg"

import { useGlobalState } from "common/contexts/GlobalContext"

import "./room.scss"

const initRoomInfo: IRoomInfo = { uuid: "" }

export default function Room() {
  // const { t } = useTranslation()
  const { state } = useGlobalState()
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
    <Layout>

      <Layout.Header>
        <Row>
          <Col flex="auto">
            <NavLink className="brand" to="/">
              <span>ROOM CAFE</span>
              <LogoSVG width={24} height={24} />
              <sup>Beta</sup>
            </NavLink>
            <span className="nav-item">{state.user?.name}</span>
          </Col>

          <Col className="navs">

          </Col>
        </Row>
      </Layout.Header>

      <Layout.Content>
        <div className="room">

        {
          // (roomInfo.whiteboard_id && roomInfo.whiteboard_token) &&
          //   <WhiteBoard uuid={roomInfo.whiteboard_id} roomToken={roomInfo.whiteboard_token} />
        }

        {
          (roomInfo.rtc_app_id && roomInfo.rtc_channel && roomInfo.rtc_token) &&
          <RTC
            rtc_app_id={roomInfo.rtc_app_id}
            rtc_channel={roomInfo.rtc_channel}
            rtc_token={roomInfo.rtc_token}
          />
        }

        {/* <Streams v-if="RTC.roomState === 2" /> */}
        {/* <Chat v-if="RTC.roomState === 2" /> */}

        </div>
      </Layout.Content>
    </Layout>
  )
}
