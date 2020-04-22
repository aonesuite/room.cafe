import React, { useState, useEffect, useCallback } from "react"

import { useParams, useLocation } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { Button, Modal } from "antd"
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons"

import { UserAPI } from "../api/user"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function OAuthCallback() {
  const { t } = useTranslation()

  const { provider } = useParams()
  const query = useQuery()
  const code = query.get("code") || ""
  const state = query.get("state") || ""

  const [oauthSignedFailed, setOauthSignedFailed] = useState(false)

  const signin = (_provider: string) => {
    UserAPI.Authorize(_provider).then((resp) => {
      window.location.href = resp.data.auth_url
    })
  }

  const callbabck = useCallback(
    () => {
      UserAPI.AuthorizeCallback({ provider: provider || "", code, state })
        .then(() => {
          setOauthSignedFailed(false)
          const redirect = window.localStorage.getItem("redirect")
          window.location.href = redirect === null ? "/" : redirect
        })
        .catch(() => {
          setOauthSignedFailed(true)
        })
    },
    [provider, code, state]
  )

  useEffect(() => {
    callbabck()
  }, [callbabck])

  return (
    <div className="oauth-signin">

      {
        oauthSignedFailed === false &&
        <div className="loading">
          <div className="spinner spinner-border" />
          { provider === "google" && <GoogleOutlined className="icon" /> }
          { provider === "github" && <GithubOutlined className="icon" /> }
        </div>
      }

      <Modal
        title={ t("quick_start") }
        className="modal-oauth"
        visible={ oauthSignedFailed }
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
