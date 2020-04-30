import React from "react"
import { observable, action } from "mobx"

import { IUser } from "models"

export class GlobalStore {

  @observable
  user?: IUser

  @action
  setUser(user: IUser) {
    this.user = user
  }
}

export const globalStore = new GlobalStore()

export const appContext = React.createContext({
  globalStore
})

export const useGlobalStore = () => React.useContext(appContext)
