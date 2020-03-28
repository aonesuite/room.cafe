import axios from "axios"
import { IRoomArgs, IRoomInfo } from "../models"

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

}
