import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { Modal, Tabs, Select } from "antd"

import i18n from "i18next"
import { langs, changeLanguage } from "locales/i18n"

import { clarities } from "constants/clarity"

import { useRoomStore } from "./context"
import { VideoEncoderConfigurationPreset } from "agora-rtc-sdk-ng"

const { TabPane } = Tabs

export interface IQuickStartOptions {
  visible: boolean
  onCancel: () => void
}

const Settings = observer((options: IQuickStartOptions) => {
  const { t } = useTranslation()
  const { roomStore } = useRoomStore()

  const setClarity = (clarity: string) => {
    roomStore.localVideoTrack?.setEncoderConfiguration(clarity as VideoEncoderConfigurationPreset)
  }

  useEffect(() => {
    console.log(roomStore)
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
          {t("room_settings.general")}
        </TabPane>

        <TabPane tab={t("room_settings.bandwidth")} key="bandwidth">
          <label htmlFor="bandwidth">{t("room_settings.incoming_video")}</label>
          <Select
            id="bandwidth"
            style={{width: "100%"}}
            placeholder={t("room_settings.placeholder_select_resolution")}
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
