import React from "react"

import { NavLink } from "react-router-dom"
import { Layout, Row, Col, Menu } from "antd"

import { useGlobalState } from "../../contexts/GlobalContext"

export default function Navigation() {
  const { state } = useGlobalState()

  return(
    <Layout.Header>
      <Row>
        <Col>
          <NavLink className="logo" to="/" />
        </Col>

        <Col flex="auto">
          <Menu
            selectedKeys={[window.location.pathname]}
            theme="dark"
            mode="horizontal">

            <Menu.Item key="/">
              <NavLink to="/">Home</NavLink>
            </Menu.Item>

          </Menu>
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
