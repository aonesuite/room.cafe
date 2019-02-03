/*
 * Created on Sun Feb 03 2019
 * Copyright (c) 2019 Miclle Zheng <miclle.zheng@gmail.com>
 * Distributed under terms of the MIT license.
 */
export interface RoomArgs {
  name?: string;
  private?: boolean;
}

export interface RoomInfo {
  id?: number;
  uuid: string;
  name?: string;
  private?: boolean;
  state?: string;
  owner?: number;
  rtc_token?: string;
  whiteboard_id?: string;
  whiteboard_token?: string;
  created_at?: number;
  updated_at?: number;
}