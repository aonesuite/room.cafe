import EventEmitter from "wolfy87-eventemitter"
import { Room, RoomPhase, RoomWhiteboard, WhiteWebSdk } from "white-react-sdk"

export class Whiteboard extends EventEmitter {

  private whiteboardSDK: WhiteWebSdk
  private room?: Room

  public uuid?: string
  public roomToken?: string
  public userToken?: string
  public disableOperations?: boolean

  public constructor(params?: any) {
    super()

    this.whiteboardSDK = new WhiteWebSdk(params)
  }

}
