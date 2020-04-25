import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { observer } from "mobx-react-lite"
import fscreen from "fscreen"
import { useTranslation } from "react-i18next"
import CopyToClipboard from "react-copy-to-clipboard"
import { Layout, Row, Col, Button, Tooltip, Modal, Input, message } from "antd"

import {
  LogoSVG,
  ChalkboardSVG,
  CommentAltLinesSVG,
  CogSVG,
  SignOutAltSVG,
  UserPlusSVG,
  LinkSVG,
  MicrophoneSlashSVG,
  MicrophoneSVG,
  VideoSlashSVG,
  VideoSVG,
  ScreenNormalSVG,
  ScreenFullSVG
} from "assets/icons"

import { useGlobalStore } from "common/contexts/GlobalContext"
import { useRoomStore } from "./context"
import Settings from "./settings"

import "./room.scss"

const Navbar = observer(() => {
  const { t } = useTranslation()
  const { globalStore } = useGlobalStore()
  const { roomStore } = useRoomStore()

  const shareLink = `https://room.cafe/room/${roomStore.info?.uuid}`

  const [invitePeopleModalVisible, setInvitePeopleModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  // 全屏事件监听
  useEffect(() => {
    if (fscreen.fullscreenEnabled) {
      fscreen.addEventListener("fullscreenchange", () => { roomStore.isFullscreen = fscreen.fullscreenElement !== null }, false)
    }
  }, [roomStore])

  // 全屏切换
  const switchFullscreen = () => {
    roomStore.isFullscreen ? fscreen.exitFullscreen() : fscreen.requestFullscreen(document.documentElement)
  }

  // 离开房间
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
              <Tooltip placement="bottom" title={ t("invite_people") }>
                <Button type="link" onClick={() => setInvitePeopleModalVisible(true)}>
                  <UserPlusSVG width={22} height={22} />
                </Button>
              </Tooltip>

              <Modal
                title={t("invite_people")}
                visible={invitePeopleModalVisible}
                onCancel={() => setInvitePeopleModalVisible(false)}
                centered={true}
                footer={null}
                bodyStyle={{ textAlign: "right" }}>
                <Input size="large" readOnly={true} value={shareLink} />

                <CopyToClipboard text={shareLink} onCopy={() => message.success(t("copy_link_success"))}>
                  <Button size="large" style={{ marginTop: 5 }}>
                    <LinkSVG width={18} height={18} style={{ verticalAlign: "middle", marginRight: 3 }} />
                    { t("copy_link_to_share") }
                  </Button>
                </CopyToClipboard>
              </Modal>
            </li>

            <li className="nav-item">
              <Tooltip placement="bottom" title={ t("whiteboard") }>
                <Button type="link">
                  <ChalkboardSVG width={22} height={22} />
                </Button>
              </Tooltip>
            </li>

            <li className="nav-item">
              <Tooltip placement="bottom" title={ roomStore.chatPopUp ? t("close_chat") : t("open_chat") }>
                <Button type="link" onClick={ () => roomStore.chatPopUp = !roomStore.chatPopUp }>
                  <CommentAltLinesSVG width={22} height={22} />
                </Button>
              </Tooltip>
            </li>

            <li className="nav-item">
              <Tooltip placement="bottom" title={ roomStore.RTC.localStream.audioMuted ? t("microphone_open") : t("microphone_mute") }>
                <Button type="link" onClick={ () => roomStore.RTC.setLocalTrackMute("audio", !roomStore.RTC.localStream.audioMuted) }>
                  { roomStore.RTC.localStream.audioMuted ? <MicrophoneSlashSVG height={22} /> : <MicrophoneSVG height={22} /> }
                </Button>
              </Tooltip>
            </li>

            <li className="nav-item">
              <Tooltip placement="bottom" title={ roomStore.RTC.localStream.videoMuted ? t("video_open") : t("video_mute") }>
                <Button type="link" onClick={ () => roomStore.RTC.setLocalTrackMute("video", !roomStore.RTC.localStream.videoMuted) }>
                  { roomStore.RTC.localStream.videoMuted ? <VideoSlashSVG height={22} /> : <VideoSVG height={22} /> }
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
                <Button type="link" onClick={() => setSettingsModalVisible(true) }>
                  <CogSVG width={22} height={22} />
                </Button>
              </Tooltip>
              <Settings visible={ settingsModalVisible } onCancel={() => setSettingsModalVisible(false) } />
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
