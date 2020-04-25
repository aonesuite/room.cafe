export interface IOAuthSignInArgs {
  provider: string
  state:    string
  code?:    string
}

export interface IUserArgs {
  name:    string
  email:   string
  gender?: string
}

export interface IUser {
  id:        number
  name:      string
  email?:    string
  gender?:   string
  avatar?:   string
  signed_in: boolean
}
