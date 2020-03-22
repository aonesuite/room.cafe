
export interface IOAuthSignInArgs {
  provider: string
  state:    string
  code?:    string
}

export interface IUserArgs {
  name:    string
  email?:  string
  gender?: string
}

export interface IUserOptions {
  id:      number
  name:    string
  email?:  string
  gender?: string
  avatar?: string
}

export class User {
  public id:      number
  public name:    string
  public email?:  string
  public gender?: string
  public avatar?: string

  public constructor(options: IUserOptions) {
    this.id     = options.id
    this.name   = options.name
    this.email  = options.email
    this.gender = options.gender
    this.avatar = options.avatar
  }
}
