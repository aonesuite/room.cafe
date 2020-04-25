import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import i18n from "i18next"
import { langs, changeLanguage } from "locales/i18n"
import AgoraRTC, { VideoEncoderConfigurationPreset, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng"
import { Modal, Tabs, Select } from "antd"

import { clarities } from "constants/clarity"
import { useRoomStore } from "./context"

const { TabPane } = Tabs

export interface IQuickStartOptions {
  visible: boolean
  onCancel: () => void
}

const initMediaDeviceInfo: MediaDeviceInfo[] = []

const Settings = observer((options: IQuickStartOptions) => {
  const { t } = useTranslation()
  const { roomStore } = useRoomStore()
  const [videoDevices, setvideoDevices] = useState(initMediaDeviceInfo)
  const [audioDevices, setAudioDevices] = useState(initMediaDeviceInfo)

  const setDevise = (kind: string, devise: string) => {
    switch (kind) {
      case "video":
        const localVideoTrack = roomStore.RTC.localStream.videoTrack as ICameraVideoTrack
        if (localVideoTrack) {
          localVideoTrack.setDevice(devise)
        }

        break
      case "audio":
        const localAudioTrack = roomStore.RTC.localStream.audioTrack as IMicrophoneAudioTrack
        if (localAudioTrack) {
          localAudioTrack.setDevice(devise)
        }
        break
    }
  }

  const setClarity = (clarity: string) => {
    roomStore.RTC.setLocalVideoTrackClarity(clarity as VideoEncoderConfigurationPreset)
  }

  useEffect(() => {
    // 获取所有音视频设备
    AgoraRTC.getDevices().then(devices => {
      setvideoDevices(devices.filter((device) => device.kind === "videoinput"))
      setAudioDevices(devices.filter((device) => device.kind === "audioinput"))
    })
  }, [roomStore])

  return (
    <Modal
      visible={ options.visible }
      closable={false}
      centered={true}
      onCancel={() => options.onCancel()}
      footer={false}>

      <Tabs defaultActiveKey="general">
        <TabPane tab={t("room_settings.general")} key="general">
          <label htmlFor="video-device">{t("room_settings.camera")}</label>
          <Select
            id="video-device"
            style={{width: "100%", marginBottom: 10}}
            placeholder={t("room_settings.placeholder_select_camera")}
            onChange={(devise: string) => setDevise("video", devise)}>
            {
              videoDevices.map(device =>
                <Select.Option key={device.groupId + device.deviceId} value={device.deviceId}>{device.label}</Select.Option>
              )
            }
          </Select>

          <label htmlFor="microphone-device">{t("room_settings.microphone")}</label>
          <Select
            id="microphone-device"
            style={{width: "100%"}}
            placeholder={t("room_settings.placeholder_select_microphone")}
            onChange={(devise: string) => setDevise("audio", devise)}>
            {
              audioDevices.map(device =>
                <Select.Option key={device.groupId + device.deviceId} value={device.deviceId}>{device.label}</Select.Option>
              )
            }
          </Select>
        </TabPane>

        <TabPane tab={t("room_settings.bandwidth")} key="bandwidth">
          <label htmlFor="bandwidth">{t("room_settings.incoming_video")}</label>
          <Select
            id="bandwidth"
            style={{width: "100%"}}
            placeholder={t("room_settings.placeholder_select_resolution")}
            defaultValue={roomStore.RTC.localVideoTrackClarity}
            onChange={(clarity: string) => setClarity(clarity)}>
            {
              clarities.map(clarity =>
                <Select.Option key={clarity.value} value={clarity.value}>{clarity.label}</Select.Option>
              )
            }
          </Select>
        </TabPane>

        <TabPane tab={t("room_settings.langs")} key="langs">
          <label htmlFor="langs">{t("room_settings.langs")}</label>
          <Select
            id="langs"
            style={{width: "100%"}}
            defaultValue={i18n.language}
            onChange={(lang) => changeLanguage(lang)}>
            {
              Object.keys(langs).map(key =>
                <Select.Option key={key} value={key}>{langs[key]}</Select.Option>
              )
            }
          </Select>
        </TabPane>
      </Tabs>
    </Modal>
  )
})

export default Settings
