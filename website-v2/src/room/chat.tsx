import React from "react"
import className from "classnames"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { Button, Form, Input } from "antd"

import { ReactComponent as CommentAltLinesSVG } from "assets/icons/CommentAltLines.svg"
import { ReactComponent as TimesSVG } from "assets/icons/Times.svg"

import { useGlobalStore } from "common/contexts/GlobalContext"
import { useRoomStore } from "./context"
import { ChatMessage } from "models"

const Chat = observer(() => {
  const { t } = useTranslation()
  const { globalStore } = useGlobalStore()
  const { roomStore } = useRoomStore()

  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    const message = new ChatMessage({
      content: values.content as string,
      userId:  `${globalStore.user?.id}`
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
        <span className="ml-1">{ t("chat") }</span>

        <Button className="float-right" type="link" size="small" onClick={ () => roomStore.chatPopUp = false }>
          <TimesSVG height="20" />
        </Button>
      </header>

      <ul className="message-list">
        {
          roomStore.RTM.chatMessages.map((message, index) =>
          <li key={`${message.timestamp}-${message.userId}-${index}`}>
            <div className="avatar">
              <img src="" alt="" width="64" height="64" />
            </div>

            <div className="body">
              <h6 className="userinfo">
                <span>{ message.userId }</span>
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

        <Form.Item name="content" rules={[{ required: true }]}>
          <Input.TextArea
            autoSize={{minRows: 1, maxRows: 4}}
            placeholder={ t("placeholder_send_message") }
            onPressEnter={ () => form.submit() }
          />
        </Form.Item>
      </Form>
    </div>
  )
})

export default Chat
