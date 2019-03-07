/*
 * Created on Fri Mar 08 2019
 * Copyright (c) 2019 Miclle Zheng <miclle.zheng@gmail.com>
 * Distributed under terms of the MIT license.
 */
import EventEmitter from "wolfy87-eventemitter";

import * as SDK from 'white-web-sdk';

const whiteboardSdk = new SDK.WhiteWebSdk();

export class WhiteBoard extends EventEmitter {

  private _whiteboard?: SDK.Room

  public constructor() {
    super();
  }

  public joinRoom(params: SDK.JoinRoomParams, callbacks?: SDK.RoomCallbacks) {
    return whiteboardSdk.joinRoom(params, callbacks).then((room) => {
      this._whiteboard = room as SDK.Room;
    })
  }

}