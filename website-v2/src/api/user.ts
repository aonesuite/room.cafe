import axios from "axios"
import { IOAuthSignInArgs, IUserArgs, IUser } from "models"

export class UserAPI {

  // 用户状态
  static async State(): Promise<IUser> {
    const resp = await axios.get<IUser>("/user/state")
    return resp.data as IUser
  }

  // 创建用户
  static async AutoCreate(args: IUserArgs): Promise<IUser> {
    const resp = await axios.post<IUser>("/user", args)
    return resp.data as IUser
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
  static AuthorizeCallback(args: IOAuthSignInArgs) {
    return axios.get(`/authorize/${args.provider}/callback`, {params: args})
  }

}
