import axios from 'axios'

// 用户状态
export function State () {
  return axios.get('/user/state')
}
