/*
 * Created on Sat Feb 02 2019
 * Copyright (c) 2019 Miclle Zheng <miclle.zheng@gmail.com>
 * Distributed under terms of the MIT license.
 */
export interface UserArgs {
  name: string;
  email?: string;
  gender?: string;
}

export interface UserOptions {
  id: number;
  name: string;
  email?: string;
  gender?: string;
  avatar?: string;
}

export class User {
  public id: number;
  public name: string;
  public email?: string;
  public gender?: string;
  public avatar?: string;

  public constructor(options: UserOptions) {
    this.id = options.id;
    this.name = options.name;
    this.email = options.email;
    this.gender = options.gender;
    this.avatar = options.avatar;
  }
}