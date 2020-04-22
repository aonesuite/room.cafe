import React from "react"
import { observable, computed, action } from "mobx"

import { RoomAPI } from "api/room"
import { IRoomInfo, IRTN, IWhiteboard, IAttendee, RTM, RTC } from "models"

export class RoomStore {
  @observable
  uuid?: string

  @observable
  info?: IRoomInfo

  @observable
  rtn?: IRTN

  @observable
  whiteboard?: IWhiteboard

  @observable
  RTC: RTC = new RTC()

  @observable
  RTM: RTM = new RTM()

  @observable
  isFullscreen: boolean = false

  @observable
  chatPopUp: boolean = false

  @computed
  get attendees(): IAttendee[] | undefined {
    return this.info?.attendees
  }

  @action
  async init(uuid?: string) {
    if (uuid !== undefined) {
      this.uuid = uuid
      this.info = await RoomAPI.Info(uuid)
      this.rtn = await RoomAPI.rtn(uuid)
      this.whiteboard = await RoomAPI.whiteboard(uuid)

      await this.RTC.init(this.rtn)
      await this.RTM.init(this.rtn)
    }
  }

  @action
  async leave() {
    await this.RTC.leave()
    await this.RTM.leave()
  }
}

export const roomContext = React.createContext({
  roomStore: new RoomStore()
})

export const useRoomStore = () => React.useContext(roomContext)
