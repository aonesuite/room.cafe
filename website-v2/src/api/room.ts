import axios from "axios"
import { IRoomArgs } from "../models"

// 创建房间
export function Create(args?: IRoomArgs) {
  return axios.post("/room")
}

// 房间信息
export function Info(uuid: string) {
  return axios.get(`/room/${uuid}`)
}
