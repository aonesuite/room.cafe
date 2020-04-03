import React from "react"
import { observable, action } from "mobx"

import { IUser } from "models"

export class GlobalStore {
  @observable
  title?: string

  @observable
  signedIn?: boolean

  @observable
  user?: IUser

  @action
  setUser(user: IUser) {
    this.user = user
  }
}

export const appContext = React.createContext({
  globalStore: new GlobalStore()
})

export const useGlobalStore = () => React.useContext(appContext)
