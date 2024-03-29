import React from "react"
import className from "classnames"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { Button, Form, Input } from "antd"

import { CommentAltLinesSVG, TimesSVG } from "assets/icons"

import { useRoomStore } from "../room/context"
import { ChatMessage, IAttendee } from "models"

import "./chat.scss"

const Chat = observer(() => {
  const { t } = useTranslation()
  const { roomStore } = useRoomStore()

  const [form] = Form.useForm()

  const getMember = (uid: string): IAttendee | undefined => {
    return roomStore.attendees?.find(item => `${item.uid}` === uid)
  }

  const onFinish = async (values: any) => {

    if (values.content === undefined || values.content.trim() === "") {
      form.resetFields()
      return
    }

    const message = new ChatMessage({
      content: values.content as string,
      uid:  `${roomStore.info?.self.uid}`
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
          <li key={`${message.timestamp}-${message.uid}-${index}`} className={className({ "self": `${roomStore.info?.self.uid}` === message.uid })}>
            <div className="avatar">
              <img src="" alt="" width="64" height="64" />
            </div>

            <div className="body">
              <h6 className="userinfo">
                <span>{ getMember(message.uid)?.name || message.uid }</span>
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
