import axios from 'axios'
import { OAuthSignInArgs, UserArgs } from '@/types/user'

// 用户状态
export function State () {
  return axios.get('/user/state')
}

// 创建用户
export function AutoCreate (args: UserArgs) {
  return axios.post('/user', args)
}

// 用户退出
export function Logout () {
  return axios.delete('/user/logout')
}

// OAuth get redirect url
export function Authorize (provider: string) {
  return axios.get('/authorize/' + provider)
}

// OAuth callback
export function AuthorizeCallback (provider: string, args: OAuthSignInArgs) {
  return axios.get(`/authorize/${provider}/callback`, {params: args})
}
