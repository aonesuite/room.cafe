import React from "react"
import className from "classnames"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { Button, Form, Input } from "antd"

import { ReactComponent as CommentAltLinesSVG } from "assets/icons/CommentAltLines.svg"
import { ReactComponent as TimesSVG } from "assets/icons/Times.svg"

import { useGlobalStore } from "common/contexts/GlobalContext"
import { useRoomStore } from "../room/context"
import { ChatMessage } from "models"

import "./chat.scss"

const Chat = observer(() => {
  const { t } = useTranslation()
  const { globalStore } = useGlobalStore()
  const { roomStore } = useRoomStore()

  const [form] = Form.useForm()

  const onFinish = async (values: any) => {

    if (values.content === undefined || values.content.trim() === "") {
      form.resetFields()
      return
    }

    const message = new ChatMessage({
      content: values.content as string,
      uid:  `${globalStore.user?.id}`
    })

    roomStore.RTM.sendMessage(message).then(() => {
      form.resetFields()
      roomStore.RTM.chatMessages.push(message)
    })
  }

  return (
    <div id="chat" className={className({open: roomStore.chatPopUp})}>
      <header>
        <CommentAltLinesSVG height="16" />
        <span style={{ marginLeft: 5 }}>{ t("chat") }</span>

        <Button type="link" size="small" onClick={ () => roomStore.chatPopUp = false }>
          <TimesSVG height="20" />
        </Button>
      </header>

      <ul className="message-list">
        {
          roomStore.RTM.chatMessages.map((message, index) =>
          <li key={`${message.timestamp}-${message.uid}-${index}`}>
            <div className="avatar">
              <img src="" alt="" width="64" height="64" />
            </div>

            <div className="body">
              <h6 className="userinfo">
                <span>{ message.uid }</span>
              </h6>
              <p>{ message.content }</p>
            </div>
          </li>
          )
        }
      </ul>

      <Form
        form={form}
        name="signin"
        className="intercom"
        onFinish={onFinish}>

        <Form.Item name="content">
          <Input.TextArea
            autoSize={{minRows: 2, maxRows: 4}}
            placeholder={ t("placeholder_send_message") }
            onPressEnter={ () => { form.submit(); return false } }
          />
        </Form.Item>
      </Form>
    </div>
  )
})

export default Chat
