import axios from "axios"
import { IRoomArgs, IRoomInfo, IRTN, IWhiteboard } from "../models"

export class RoomAPI {

  // 创建房间
  static async Create(args?: IRoomArgs): Promise<IRoomInfo> {
    const resp = await axios.post("/room", args)
    return resp.data as IRoomInfo
  }

  // 房间信息
  static async Info(uuid: string): Promise<IRoomInfo> {
    const resp = await axios.get(`/room/${uuid}`)
    return resp.data as IRoomInfo
  }

  static async rtn(uuid: string): Promise<IRTN> {
    const resp = await axios.get(`/room/${uuid}/rtn`)
    return resp.data as IRTN
  }

  static async whiteboard(uuid: string): Promise<IWhiteboard> {
    const resp = await axios.get(`/room/${uuid}/whiteboard`)
    return resp.data as IWhiteboard
  }
}
