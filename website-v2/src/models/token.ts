import axios from "axios"

export interface IUploadToken {
  domain:    string
  expire_at: number
  token:     string
}

export class IUploadToken {
  domain:    string = ""
  expire_at: number = 0
  token:     string = ""

  public expired(): boolean {
    return new Date().getTime() > this.expire_at * 1000
  }

  static GetUploadAvatarToken(): Promise<IUploadToken> {
    return axios.get("/uploader/avatar")
  }
}
