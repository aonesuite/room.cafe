import React, { useState } from "react"

import { useTranslation } from "react-i18next"
import { Button, Modal } from "antd"
import { GoogleOutlined, GithubOutlined, LoadingOutlined } from "@ant-design/icons"

import { UserAPI } from "../api/user"

export default function OAuthCallback() {
  const { t } = useTranslation()
  const [oauthSignedFailed, setOauthSignedFailed] = useState(false)

  const redirect = window.localStorage.getItem("redirect")

  const signin = (provider: string) => {
    window.localStorage.setItem("redirect", window.location.href)
    UserAPI.Authorize(provider).then((resp) => {
      window.location.href = resp.data.auth_url
    })
  }

  return (
    <div className="oauth-signin">

      {
        oauthSignedFailed === false &&
        <div className="loading">
          <LoadingOutlined />
        </div>
      }

      <Modal
        title={ t("quick_start") }
        className="modal-oauth"
        visible={ true }
        centered={true}
        footer={null}>

        <div className="hint-allow">
          <h5 className="text-center">{ t("oauth_signin_failed_hint") }</h5>

          <div className="oauth-actions">
            <div className="providers">
              <Button type="link" icon={ <GoogleOutlined /> } onClick={ () => signin("google") }>
                <span>Google</span>
              </Button>

              <Button type="link" icon={ <GithubOutlined /> } onClick={ () => signin("github") }>
                <span>GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  )
}