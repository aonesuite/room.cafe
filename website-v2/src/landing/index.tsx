import React, { useState } from "react"

import { BrowserRouter, NavLink } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { langs, changeLanguage } from "../locales/i18n"

import { Layout, Button, Row, Col, Popover, List } from "antd"
import { GlobalOutlined } from "@ant-design/icons"

import { ReactComponent as VideoSVG } from "../assets/icons/Video.svg"
import { ReactComponent as ChalkboardSVG } from "../assets/icons/Chalkboard.svg"
import { ReactComponent as CommentAltLinesSVG } from "../assets/icons/CommentAltLines.svg"
import { ReactComponent as LogoSVG } from "../assets/icons/Logo.svg"

import { useGlobalState } from "../common/contexts/GlobalContext"

import { RoomAPI } from "../api/room"

import QuickStart from "../quick-start"

import "./landing.scss"

const { Header, Content, Footer } = Layout

export default function Landing() {
  const { t } = useTranslation()
  const { state } = useGlobalState()
  const [modalVisible, setModalVisible] = useState(false)

  const menu = (
    <List
      size="small"
      dataSource={Object.keys(langs)}
      renderItem={key => (
        <List.Item style={{ padding: 0 }}>
          <Button type="link" onClick={ () => changeLanguage(key) }>{ langs[key] }</Button>
        </List.Item>
      )}
    />
  )

  const quickStart = async (type?: string) => {
    if (state.signedIn) {
      const roomInfo = await RoomAPI.Create()
      window.location.href = `/room/${roomInfo.uuid}`
    } else {
      setModalVisible(true)
    }
  }

  return(
    <BrowserRouter>

      <QuickStart visible={modalVisible} onCancel={ () => setModalVisible(false) } />

      <Layout>

        <Header>
          <Row>
            <Col flex="auto">
              <NavLink className="brand" to="/">
                <span>ROOM CAFE</span>
                <LogoSVG width={24} height={24} />
                <sup>Beta</sup>
              </NavLink>
            </Col>

            <Col className="navs">
              <span className="nav-item">{state.user?.name}</span>

              <Popover content={menu} trigger={["click"]}>
                <Button className="nav-item" icon={<GlobalOutlined />} type="link" />
              </Popover>

              <Button className="nav-item btn-success" onClick={ () => quickStart("quick_start") }>{ t("quick_start") }</Button>

              {
                state.signedIn === false &&
                <React.Fragment>
                  <Button className="nav-item btn-success" onClick={ () => quickStart("sign_in") }>{ t("sign_in") }</Button>
                </React.Fragment>
              }
            </Col>
          </Row>
        </Header>

        <Content>
          <div className="welcome">
            <div className="photograph"></div>
            <div className="hero">
              <div className="section">

                <h1>{ state.signedIn === false ? t("slogan") : t("sloganSignedIn", {name: state.user?.name}) }</h1>
                <h3>{ state.signedIn === false ? t("welcome") : t("welcomeSignedIn") }</h3>

                <div className="feature-actions">
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <Button shape="circle" onClick={ () => quickStart("f2f") }>
                        <VideoSVG />
                      </Button>
                      <span>{ t("video_call") }</span>
                    </li>

                    <li className="list-inline-item">
                      <Button shape="circle" onClick={ () => quickStart("board") }>
                        <ChalkboardSVG />
                      </Button>
                      <span>{ t("board") }</span>
                    </li>

                    <li className="list-inline-item">
                      <Button shape="circle" onClick={ () => quickStart("im") }>
                        <CommentAltLinesSVG />
                      </Button>
                      <span>{ t("message") }</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          <div className="features">
            <div className="media">
              <VideoSVG />
              <div className="media-body">
                <h2>{ t("video_call") }</h2>
                <ul className="list-unstyled">
                  {
                    (t("video_call_features", { returnObjects: true }) as string[])
                      .map((text, index) => <li key={index}>{ text }</li>)
                  }
                </ul>
              </div>
            </div>

            <div className="media">
              <ChalkboardSVG />
              <div className="media-body">
                <h2>{ t("board") }</h2>
                <ul className="list-unstyled">
                  {
                    (t("board_features", { returnObjects: true }) as string[])
                      .map((text, index) => <li key={index}>{ text }</li>)
                  }
                </ul>
              </div>
            </div>

            <div className="media">
              <CommentAltLinesSVG />
              <div className="media-body">
                <h2>{ t("messaging") }</h2>
                <ul className="list-unstyled">
                  {
                    (t("message_features", { returnObjects: true }) as string[])
                      .map((text, index) => <li key={index}>{ text }</li>)
                  }
                </ul>
              </div>
            </div>
          </div>
        </Content>

        <Footer>
          <p className="text-muted text-center">
            {"Built with love by the "}
            <a className="text-muted" href="https://room.cafe/">Room.Cafe</a>
            {" team. "}

            <a
              className="text-muted"
              href="https://jinshuju.net/f/2UlDEj"
              target="_blank"
              rel="noopener noreferrer">
              { t("contact") }
            </a>
          </p>
          <p className="text-muted text-center">
            © Copyright 2020 5seconds.info Technologies, Inc. All rights reserved.
          </p>
        </Footer>
      </Layout>
    </BrowserRouter>
  )
}
