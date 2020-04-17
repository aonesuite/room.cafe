import React from "react"
import { observer } from "mobx-react-lite"
import { BrowserRouter } from "react-router-dom"
import { renderRoutes } from "react-router-config"

import { ConfigProvider } from "antd"

import routes from "routes"

const App = observer(() => {
  return (
    <ConfigProvider prefixCls="app">
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </ConfigProvider>
  )
})

export default App
