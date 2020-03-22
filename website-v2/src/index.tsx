import React from "react"
import ReactDOM from "react-dom"

import axios from "axios"

import App from "./App"

import "./assets/main.scss"
import "white-web-sdk/style/index.css"

import * as serviceWorker from "./serviceWorker"
import { UserAPI } from "./api/user"
import { User } from "./models"

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL
axios.defaults.withCredentials = true

let currentUser: User

UserAPI.State()
  .then((user: User) => {
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
