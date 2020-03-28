import React, { useState, useEffect, useCallback } from "react"

import { useTranslation } from "react-i18next"
import { Room, RoomPhase, WhiteWebSdk, RoomWhiteboard, JoinRoomParams, Color, MemberState } from "white-react-sdk"
import { Button, Tooltip, Menu, Popover, Slider } from "antd"

import { ReactComponent as MousePointerSVG } from "../assets/icons/MousePointer.svg"
import { ReactComponent as PencilAltSVG } from "../assets/icons/PencilAlt.svg"
import { ReactComponent as TextSVG } from "../assets/icons/Text.svg"
import { ReactComponent as SquareSVG } from "../assets/icons/Square.svg"
import { ReactComponent as CircleSVG } from "../assets/icons/Circle.svg"
import { ReactComponent as EraserSVG } from "../assets/icons/Eraser.svg"
import { ReactComponent as ImagesSVG } from "../assets/icons/Images.svg"

import { colors } from "../utils/color"

import "white-web-sdk/style/index.css"
import "./whiteboard.scss"

interface IWhiteBoardState {
  room?: Room
  phase?: RoomPhase
}

const whiteWebSdk = new WhiteWebSdk()
const initWhiteBoardState: IWhiteBoardState = {}
const initMemberState: MemberState = {
  currentApplianceName: "pencil",
  strokeColor: [],
  strokeWidth: 4,
  textSize: 14,
  pencilOptions: {
    disableBezier: false,
    sparseWidth: 5,
    sparseHump: 5
  }
}

export default function WhiteBoard(params: JoinRoomParams) {
  const { t } = useTranslation()

  const [whiteBoardState, setWhiteBoardState] = useState(initWhiteBoardState)
  const [memberState, setMemberState] = useState(initMemberState)

  const [strokeTooltipState, setStrokeTooltipState] = useState([false, false])

  // 设置教具
  const setAppliance = (appliance: string) => {
    whiteBoardState.room?.setMemberState({ currentApplianceName: appliance })
  }

  // 设置笔触颜色
  const setStrokeColor = (color: Color) => {
    whiteBoardState.room?.setMemberState({ strokeColor: color })
  }

  // 设置笔触宽度
  const setStrokeWidth = (value: number) => {
    whiteBoardState.room?.setMemberState({ strokeWidth: value })
  }

  const initWhiteBoard = useCallback(
    () => {
      whiteWebSdk.joinRoom(
        { uuid: params.uuid, roomToken: params.roomToken },
        {
          onRoomStateChanged: (state) => {
            if (state.memberState) {
              setMemberState(state.memberState)
            }
          }
        }
      )
      .then((room) => {
        setWhiteBoardState({ room, phase: RoomPhase.Connecting})
        setMemberState(room.state.memberState)
      })
    },
    [params]
  )

  useEffect(() => {
    initWhiteBoard()
  }, [initWhiteBoard])

  return (
    <div id="whiteboard">
      {
        whiteBoardState.room !== undefined &&
        <RoomWhiteboard room={ whiteBoardState.room } className="whiteboard-main" />
      }

      <div className="toolbar">
        <Menu>
          <Menu.Item key="selector">
            <Tooltip placement="right" title={ t("whiteboard_tool.selector") }>
              <Button type="link" size="small" onClick={ () => setAppliance("selector") }
                className={ memberState.currentApplianceName === "selector" ? "active" : "" }>
                <MousePointerSVG className="icon" />
              </Button>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="pencil">
            <Tooltip placement="right" title={ t("whiteboard_tool.pencil") }>
              <Button type="link" size="small" onClick={ () => setAppliance("pencil") }
                className={ memberState.currentApplianceName === "pencil" ? "active" : "" }>
                <PencilAltSVG className="icon" />
              </Button>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="text">
            <Tooltip placement="right" title={ t("whiteboard_tool.text") }>
              <Button type="link" size="small" onClick={ () => setAppliance("text") }
                className={ memberState.currentApplianceName === "text" ? "active" : "" }>
                <TextSVG className="icon" />
              </Button>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="rectangle">
            <Tooltip placement="right" title={ t("whiteboard_tool.rectangle") }>
              <Button type="link" size="small" onClick={ () => setAppliance("rectangle") }
                className={ memberState.currentApplianceName === "rectangle" ? "active" : "" }>
                <SquareSVG className="icon" />
              </Button>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="ellipse">
            <Tooltip placement="right" title={ t("whiteboard_tool.circle") }>
              <Button type="link" size="small" onClick={ () => setAppliance("ellipse") }
                className={ memberState.currentApplianceName === "ellipse" ? "active" : "" }>
                <CircleSVG className="icon" />
              </Button>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="stroke" id="whiteboard-stroke-settings">
            <Tooltip
              placement="right"
              title={ t("whiteboard_tool.stroke_settings") }
              visible={ strokeTooltipState[0] }
              onVisibleChange={ (visible) => setStrokeTooltipState([visible, false]) }>
              <Popover
                placement="right"
                trigger="click"
                visible={strokeTooltipState[1]}
                onVisibleChange={ (visible) => setStrokeTooltipState([false, visible]) }
                content={
                  <div id="whiteboard-stroke-settings">
                    <h6>{ t("whiteboard_tool.stroke_settings_color") }</h6>
                    <div className="option-colors">
                      {
                        colors.map((color) =>
                        <Button
                          key={color.name}
                          shape="circle"
                          className={ `${color.name}` }
                          style={{ backgroundColor: color.hex }}
                          onClick={ () => setStrokeColor(color.rgb) }
                        />)
                      }
                    </div>

                    <h6>{ t("whiteboard_tool.stroke_settings_thickness") }</h6>
                    <div className="option-width">
                      <svg width="100%" height="32" viewBox="0 0 269 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill={`rgb(${memberState.strokeColor.join(",")})`}
                          stroke="#CCC"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M252 31.9693V32L0 16V15L252 0V0.030742C252.331 0.0103478 252.664 0 253 0C261.837 0 269 7.16344 269 16C269 24.8366 261.837 32 253 32C252.664 32 252.331 31.9897 252 31.9693Z" />
                      </svg>
                      <Slider
                        min={1}
                        max={32}
                        defaultValue={memberState.strokeWidth}
                        className="stroke-width-range"
                        onChange={(value) => setStrokeWidth(value as number)} />
                    </div>
                  </div>
                }>

                <Button type="link" size="small" onClick={ () => setAppliance("ellipse") } id="whiteboard-stroke">
                  <span style={{ borderColor: `rgb(${memberState.strokeColor.join(",")})` }}>
                    <span style={{
                      backgroundColor: `rgb(${memberState.strokeColor.join(",")})`,
                      width: memberState.strokeWidth,
                      height: memberState.strokeWidth
                    }} />
                  </span>
                </Button>
              </Popover>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="eraser">
            <Tooltip placement="right" title={ t("whiteboard_tool.eraser") }>
              <Button type="link" size="small" onClick={ () => setAppliance("eraser") }
                className={ memberState.currentApplianceName === "eraser" ? "active" : "" }>
                <EraserSVG className="icon" />
              </Button>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="uploader">
            <Tooltip placement="right" title={ t("whiteboard_tool.insert_images") }>
              <Button type="link" size="small">
                <ImagesSVG className="icon" />
              </Button>
            </Tooltip>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  )
}
