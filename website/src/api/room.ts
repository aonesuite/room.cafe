import axios from 'axios'
import { RoomArgs } from '@/types/room'

// 创建房间
export function Create (args?: RoomArgs) {
  return axios.post('/room')
}

// 房间信息
export function Info (uuid: string) {
  return axios.get(`/room/${uuid}`)
}
