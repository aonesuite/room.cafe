import React from "react"

import { Button, Modal, Form, Input } from "antd"
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons"

import { useTranslation } from "react-i18next"
import { UserAPI } from "../api/user"

export interface IQuickStartOptions {
  visible: boolean
  onCancel: () => void
}

export default function QuickStart(options: IQuickStartOptions) {

  const { t } = useTranslation()
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log("onFinish:", values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  }

  const signin = (provider: string) => {
    window.localStorage.setItem("redirect", window.location.href)
    UserAPI.Authorize(provider).then((resp) => {
      window.location.href = resp.data.auth_url
    })
  }

  return (

    <Modal
      title={ t("quick_start") }
      visible={ options.visible }
      centered={true}
      onCancel={ () => options.onCancel() }
      footer={null}>

      <Form
        form={form}
        name="signin"
        className="signin-form"
        size="large"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}>

        <Form.Item name="name" rules={[{ required: true, message: t("name_is_required") }]}>
          <Input placeholder={ t("login_quickly_placeholder") } />
        </Form.Item>

        <Form.Item shouldUpdate={true} style={{ textAlign: "right" }}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length).length > 0
              }>
              { t("quick_start") }
            </Button>
          )}
        </Form.Item>
      </Form>

      <div className="oauth-actions">
        <h6>{ t("oauth_signin_title") }</h6>

        <div className="providers">
          <Button type="link" icon={ <GoogleOutlined /> } onClick={ () => signin("google") }>
            <span>Google</span>
          </Button>

          <Button type="link" icon={ <GithubOutlined /> } onClick={ () => signin("github") }>
            <span>GitHub</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}