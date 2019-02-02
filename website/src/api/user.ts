import axios from 'axios'
import { UserArgs } from '@/types/user'

// 用户状态
export function State () {
  return axios.get('/user/state')
}

// 创建用户
export function AutoCreate (args: UserArgs) {
  return axios.post('/user', args)
}
