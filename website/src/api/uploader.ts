import axios from "axios"

export class UploaderAPI {

  // 获取上传 token
  static getToken() {
    return axios.get("/uploader/token")
  }

  // 获取下载 URL
  static getURL(key: string) {
    return axios.get(`/uploader/url/${key}`)
  }
}
