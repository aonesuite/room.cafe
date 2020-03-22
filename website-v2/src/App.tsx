import React, { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { renderRoutes } from "react-router-config"

import { ConfigProvider } from "antd"

import routes from "./routes"

import {
  GlobalContext,
  globalReducer,
  IAppGlobalState
} from "./common/contexts/GlobalContext"

function App(appGlobalState: IAppGlobalState) {

  const [state, dispatch] = React.useReducer(globalReducer, appGlobalState)

  useEffect(() => {
    dispatch({ type: appGlobalState.user && appGlobalState.user.id > 0 ? "SIGNED_IN" : "SIGN_OUT" })
  }, [appGlobalState])

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      <ConfigProvider prefixCls="app">
        <BrowserRouter>
          {renderRoutes(routes)}
        </BrowserRouter>
      </ConfigProvider>
    </GlobalContext.Provider>
  )
}

export default App
