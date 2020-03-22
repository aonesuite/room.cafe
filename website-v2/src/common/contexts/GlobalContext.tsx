import { createContext, useContext } from "react"
import { User } from "../../models"

export interface IAppGlobalState {
  title?: string
  signedIn?: boolean
  user?: User
}

export interface IContextProps {
  state: IAppGlobalState,
  dispatch(obj: any): any
}

export const appGlobalState: IAppGlobalState = {
  title: "Room Cafe",
  signedIn: false
}

export interface IAction {
  type: string
}

export const globalReducer: React.Reducer<IAppGlobalState, IAction> = (state, action) => {
  switch (action.type) {
    case "SIGNED_IN":
      return {...state, signedIn: true}

    case "SIGN_OUT":
      return {...state, signedIn: false}

    default:
      return state
  }
}

export const GlobalContext = createContext<IContextProps>({
  state: appGlobalState,
  dispatch: (obj: any) => {
    console.log(obj)
  }
})

// export const GlobalProvider = ({reducer, initialState, children}: any) => (
//   <GlobalContext.Provider value={useReducer(reducer, initialState)}>
//     {children}
//   </GlobalContext.Provider>
// )

/**
 * usage:
 * const { dispatch } = useGlobalState()
 */
export const useGlobalState = () => useContext(GlobalContext)
