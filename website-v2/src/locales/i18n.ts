import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enUS from "./en-US"
import zhCN from "./zh-CN"

// Ready translated locale messages
export const langs = {
  "en-US": "English",
  "zh-CN": "简体中文"
}

// Ready translated locale messages
export const resources = {
  "en-US": {
    translation: enUS
  },
  "zh-CN": {
    translation: zhCN
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en-US",
    fallbackLng: "en-US",

    interpolation: {
      escapeValue: false
    }
  })
