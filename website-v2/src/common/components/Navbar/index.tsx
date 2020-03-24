import React from "react"

import { NavLink } from "react-router-dom"
import { Layout, Row, Col } from "antd"

import { useGlobalState } from "../../contexts/GlobalContext"

import { ReactComponent as LogoSVG } from "../../../assets/icons/Logo.svg"

export default function Navigation() {
  const { state } = useGlobalState()

  return(
    <Layout.Header>
      <Row>
        <Col flex="auto">
          <NavLink className="brand" to="/">
            <span>ROOM CAFE</span>
            <LogoSVG width={24} height={24} />
            <sup>Beta</sup>
          </NavLink>
        </Col>

        <Col>
          {
            state.signedIn === false &&
            <React.Fragment>
              <NavLink className="nav-item" to="login">Sign in</NavLink>
            </React.Fragment>
          }
        </Col>
      </Row>
    </Layout.Header>
  )
}
