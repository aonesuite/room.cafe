import axios from 'axios'

// 获取上传 token
export function getToken () {
  return axios.get('/uploader/token')
}

// 获取下载 URL
export function getURL (key: string) {
  return axios.get(`/uploader/${key}/url`)
}