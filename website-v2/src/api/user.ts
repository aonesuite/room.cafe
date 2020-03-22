import axios from "axios"
import { User, IOAuthSignInArgs, IUserArgs } from "../models"

export class UserAPI {

  // 用户状态
  static async State(): Promise<User> {
    const resp = await axios.get<User>("/user/state")
    return new User(resp.data)
  }

  // 创建用户
  static AutoCreate(args: IUserArgs) {
    return axios.post("/user", args)
  }

  // 用户退出
  static Logout() {
    return axios.delete("/user/logout")
  }

  // OAuth get redirect url
  static Authorize(provider: string) {
    return axios.get("/authorize/" + provider)
  }

  // OAuth callback
  static AuthorizeCallback(provider: string, args: IOAuthSignInArgs) {
    return axios.get(`/authorize/${provider}/callback`, {params: args})
  }

}
