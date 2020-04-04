import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { BrowserRouter } from "react-router-dom"
import { renderRoutes } from "react-router-config"

import { ConfigProvider } from "antd"

import routes from "routes"

import { useGlobalStore } from "common/contexts/GlobalContext"
import { IUser } from "models"

export interface IAppOptions {
  user?: IUser
}

const App = observer((props: IAppOptions) => {
  const { globalStore } = useGlobalStore()

  useEffect(() => {
    if (props.user) {
      globalStore.setUser(props.user)
    }
  }, [props, globalStore])

  return (
    <ConfigProvider prefixCls="app">
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </ConfigProvider>
  )
})

export default App
