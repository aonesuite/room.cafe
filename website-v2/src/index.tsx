import React from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import AgoraRTC from "agora-rtc-sdk-ng"
import "locales/i18n"

import * as serviceWorker from "serviceWorker"

import App from "App"
import { UserAPI } from "api/user"
import { IUser } from "models"

import "assets/main.scss"
import "white-web-sdk/style/index.css"

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL
axios.defaults.withCredentials = true

// 生产模式禁用所有日志输出
if (process.env.NODE_ENV === "production") {
  AgoraRTC.setLogLevel(4)
}

let currentUser: IUser

UserAPI.State()
  .then((user: IUser) => {
    currentUser = user
  })
  .finally(() => {
    ReactDOM.render(
      <App user={currentUser} />,
      document.getElementById("root")
    )
  })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
