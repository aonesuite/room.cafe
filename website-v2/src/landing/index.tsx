import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { NavLink } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { langs, changeLanguage } from "locales/i18n"

import { Layout, Button, Row, Col, Popover, List } from "antd"
import { GlobalOutlined } from "@ant-design/icons"

import { VideoSVG, ChalkboardSVG, CommentAltLinesSVG, LogoSVG } from "assets/icons"

import { useGlobalStore } from "common/contexts/GlobalContext"

import { RoomAPI } from "api/room"

import QuickStart from "quick-start"

import "./landing.scss"

const { Header, Content, Footer } = Layout

const Landing = observer(() => {
  const { t } = useTranslation()
  const { globalStore } = useGlobalStore()
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
    if (globalStore.user?.signed_in) {
      const roomInfo = await RoomAPI.Create()
      window.location.href = `/room/${roomInfo.uuid}`
    } else {
      setModalVisible(true)
    }
  }

  return(
    <React.Fragment>

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
              <span className="nav-item">{globalStore.user?.name}</span>

              <Popover content={menu} trigger={["click"]}>
                <Button className="nav-item" icon={<GlobalOutlined />} type="link" />
              </Popover>

              <Button className="nav-item btn-success" onClick={ () => quickStart("quick_start") }>{ t("quick_start") }</Button>

              {
                globalStore.user?.signed_in === false &&
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

                <h1>{ globalStore.user?.signed_in ? t("sloganSignedIn", {name: globalStore.user?.name}) : t("slogan") }</h1>
                <h3>{ globalStore.user?.signed_in ? t("welcomeSignedIn") : t("welcome") }</h3>

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
    </React.Fragment>
  )
})

export default Landing
