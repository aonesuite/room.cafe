import React from "react"

import { BrowserRouter } from "react-router-dom"

import { Layout, Button } from "antd"

import { ReactComponent as VideoSVG } from "../assets/icons/Video.svg"
import { ReactComponent as ChalkboardSVG } from "../assets/icons/Chalkboard.svg"
import { ReactComponent as CommentAltLinesSVG } from "../assets/icons/CommentAltLines.svg"

import { useTranslation } from "react-i18next"

import Navigation from "../common/components/Navbar"
import MadeWithLove from "../common/components/MadeWithLove"

import { useGlobalState } from "../common/contexts/GlobalContext"

import "./landing.scss"

const { Content, Footer } = Layout

export default function Landing() {
  const { t } = useTranslation()
  const { state } = useGlobalState()

  return(
    <BrowserRouter>
      <Layout>

        <Navigation />

        <Content>

          <div className="welcome">
            <div className="photograph"></div>
            <div className="hero">
              <div className="section">

                <h1>{ state.signedIn === false ? t("slogan") : t("sloganSignedIn") }</h1>
                <h3>{ state.signedIn === false ? t("welcome") : t("welcomeSignedIn") }</h3>

                <div className="feature-actions">
                  <ul className="list-inline">
                    <li className="list-inline-item">
                      <Button shape="circle">
                        <VideoSVG />
                      </Button>
                      <span>{ t("video_call") }</span>
                    </li>

                    <li className="list-inline-item">
                      <Button shape="circle">
                        <ChalkboardSVG />
                      </Button>
                      <span>{ t("board") }</span>
                    </li>

                    <li className="list-inline-item">
                      <Button shape="circle">
                        <CommentAltLinesSVG />
                      </Button>
                      <span>{ t("message") }</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>

          <div className="features">
            <div className="media">
              <VideoSVG />
              <div className="media-body">
                <h2>{ t("video_call") }</h2>
                <ul className="list-unstyled">
                  {
                    (t("video_call_features", { returnObjects: true }) as string[])
                      .map((text, index) => <li key={index}>{ text }</li>)
                  }
                </ul>
              </div>
            </div>

            <div className="media">
              <ChalkboardSVG />
              <div className="media-body">
                <h2>{ t("board") }</h2>
                <ul className="list-unstyled">
                  {
                    (t("board_features", { returnObjects: true }) as string[])
                      .map((text, index) => <li key={index}>{ text }</li>)
                  }
                </ul>
              </div>
            </div>

            <div className="media">
              <CommentAltLinesSVG />
              <div className="media-body">
                <h2>{ t("messaging") }</h2>
                <ul className="list-unstyled">
                  {
                    (t("message_features", { returnObjects: true }) as string[])
                      .map((text, index) => <li key={index}>{ text }</li>)
                  }
                </ul>
              </div>
            </div>
          </div>

        </Content>

        <Footer>
          <MadeWithLove />
        </Footer>
      </Layout>
    </BrowserRouter>
  )
}
