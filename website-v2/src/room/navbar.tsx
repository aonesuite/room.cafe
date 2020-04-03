import React from "react"
import { NavLink } from "react-router-dom"

import { observer } from "mobx-react-lite"

// import { useTranslation } from "react-i18next"
import { Layout, Row, Col, Button } from "antd"

import { ReactComponent as LogoSVG } from "assets/icons/Logo.svg"

import { useGlobalStore } from "common/contexts/GlobalContext"
import { useRoomStore } from "./context"

import "./room.scss"

const Navbar = observer(() => {
  // const { t } = useTranslation()
  const { globalStore } = useGlobalStore()
  const { roomStore } = useRoomStore()

  return (
    <Layout.Header>
      <Row>
        <Col flex="auto">
          <NavLink className="brand" to="/">
            <span>ROOM CAFE</span>
            <LogoSVG width={24} height={24} />
            <sup>Beta</sup>
          </NavLink>
          <span className="nav-item">{globalStore.user?.name}</span>
        </Col>

        <Col className="navs">
          <Button onClick={() => roomStore.init("uuid") }>{ roomStore.uuid }</Button>
        </Col>
      </Row>
    </Layout.Header>
  )
})

export default Navbar
