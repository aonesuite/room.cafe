import React from "react"

import { BrowserRouter } from "react-router-dom"
import { RouteConfig, renderRoutes } from "react-router-config"

import { Layout } from "antd"

import Navigation from "../common/components/Navbar"
import MadeWithLove from "../common/components/MadeWithLove"

const { Content, Footer } = Layout

export default function Landing({ route }: RouteConfig) {

  return(
    <BrowserRouter>
      <Layout>

        <Navigation />

        <Content>
          {renderRoutes(route.routes)}
        </Content>

        <Footer>
          <MadeWithLove />
        </Footer>
      </Layout>
    </BrowserRouter>
  )
}
