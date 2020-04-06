import React, { useEffect } from "react"
import { NavLink } from "react-router-dom"
import { observer } from "mobx-react-lite"

import { useTranslation } from "react-i18next"
import { Layout, Row, Col, Button, Tooltip } from "antd"

import fscreen from "fscreen"

import { ReactComponent as LogoSVG } from "assets/icons/Logo.svg"
import { ReactComponent as ChalkboardSVG } from "assets/icons/Chalkboard.svg"
import { ReactComponent as CommentAltLinesSVG } from "assets/icons/CommentAltLines.svg"
import { ReactComponent as CogSVG } from "assets/icons/Cog.svg"
import { ReactComponent as SignOutAltSVG } from "assets/icons/SignOutAlt.svg"

import { ReactComponent as MicrophoneSlashSVG } from "assets/icons/MicrophoneSlash.svg"
import { ReactComponent as MicrophoneSVG } from "assets/icons/Microphone.svg"
import { ReactComponent as VideoSlashSVG } from "assets/icons/VideoSlash.svg"
import { ReactComponent as VideoSVG } from "assets/icons/Video.svg"
import { ReactComponent as ScreenNormalSVG } from "assets/icons/ScreenNormal.svg"
import { ReactComponent as ScreenFullSVG } from "assets/icons/ScreenFull.svg"

import { useGlobalStore } from "common/contexts/GlobalContext"
import { useRoomStore } from "./context"

import "./room.scss"

const Navbar = observer(() => {
  const { t } = useTranslation()
  const { globalStore } = useGlobalStore()
  const { roomStore } = useRoomStore()

  useEffect(() => {
    console.log(roomStore)
  }, [roomStore])

  useEffect(() => {
    if (fscreen.fullscreenEnabled) {
      fscreen.addEventListener("fullscreenchange", () => { roomStore.isFullscreen = fscreen.fullscreenElement !== null }, false)
    }
  }, [roomStore])

  const switchFullscreen = () => {
    roomStore.isFullscreen ? fscreen.exitFullscreen() : fscreen.requestFullscreen(document.documentElement)
  }

  const exit = async () => {
    await roomStore.leave()
    window.location.href = "/"
  }

  return (
    <Layout.Header className="navbar-room">
      <Row>
        <Col flex="auto">
          <NavLink className="brand" to="/">
            <span>ROOM CAFE</span>
            <LogoSVG width={24} height={24} />
            <sup>Beta</sup>
          </NavLink>
          <span className="nav-item">{globalStore.user?.name}</span>
        </Col>

        <Col>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Tooltip placement="bottom" title={ t("whiteboard") }>
                <Button type="link">
                  <ChalkboardSVG width={22} height={22} />
                </Button>
              </Tooltip>
            </li>

            <li className="nav-item">
              <Tooltip placement="bottom" title={ t("open_chat") }>
                <Button type="link">
                  <CommentAltLinesSVG width={22} height={22} />
                </Button>
              </Tooltip>
              {/*
                <b-tooltip id="chatTooltip" ref="chatTooltip" target="chatBtn" placement="bottom">
                  { ChatPopUp ? $t("close_chat") : $t("open_chat") }
                </b-tooltip>
              */}
            </li>


            <li className="nav-item">
              <Tooltip placement="bottom" title={ roomStore.localAudioMuted ? t("microphone_open") : t("microphone_mute") }>
                <Button type="link" onClick={ () => roomStore.localAudioMuted = !roomStore.localAudioMuted }>
                  { roomStore.localAudioMuted ? <MicrophoneSlashSVG height={22} /> : <MicrophoneSVG height={22} /> }
                </Button>
              </Tooltip>
            </li>

            <li className="nav-item">
              <Tooltip placement="bottom" title={ roomStore.localVideoMuted ? t("video_open") : t("video_mute") }>
                <Button type="link" onClick={ () => roomStore.localVideoMuted = !roomStore.localVideoMuted }>
                  { roomStore.localVideoMuted ? <VideoSlashSVG height={22} /> : <VideoSVG height={22} /> }
                </Button>
              </Tooltip>
            </li>

            {
              fscreen.fullscreenEnabled &&
              <li className="nav-item">
                <Tooltip placement="bottom" title={ roomStore.isFullscreen ? t("fullscreen_exit") : t("fullscreen") }>
                  <Button type="link" onClick={ switchFullscreen }>
                    { roomStore.isFullscreen ? <ScreenNormalSVG height={22} /> :  <ScreenFullSVG height={22} /> }
                  </Button>
                </Tooltip>
              </li>
            }

            <li className="nav-item">
              <Tooltip placement="bottom" title={ t("settings") }>
                <Button type="link">
                  <CogSVG width={22} height={22} />
                </Button>
              </Tooltip>
            </li>

            <li className="nav-item">
              <Tooltip placement="bottom" title={ t("exit") }>
                <Button type="link" onClick={ exit }>
                  <SignOutAltSVG width={22} height={22} />
                </Button>
                </Tooltip>
            </li>
          </ul>
        </Col>
      </Row>
    </Layout.Header>
  )
})

export default Navbar
