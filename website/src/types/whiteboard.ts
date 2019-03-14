/*
 * Created on Fri Mar 08 2019
 * Copyright (c) 2019 Miclle Zheng <miclle.zheng@gmail.com>
 * Distributed under terms of the MIT license.
 */
import EventEmitter from "wolfy87-eventemitter";
import * as SDK from 'white-web-sdk';

import { colors } from '../utils/color';

export declare type WhiteWebSdkConfiguration = SDK.WhiteWebSdkConfiguration;
export declare type JoinRoomParams = SDK.JoinRoomParams;
export declare type RoomCallbacks = SDK.RoomCallbacks;
export declare type Room = SDK.Room;

export class Whiteboard extends EventEmitter {

  private whiteboardSDK: SDK.WhiteWebSdk;
  private room?: Room

  public uuid?: string;
  public roomToken?: string;
  public userToken?: string;
  public disableOperations?: boolean;

  public globalState: SDK.GlobalState = {};

  public memberState?: SDK.MemberState = {
    currentApplianceName: "pencil",
    strokeColor: colors[0].rgb,
    strokeWidth: 4,
    textSize: 14,
  };

  public sceneState?: SDK.SceneState;

  public broadcastState?: SDK.BroadcastState;

  private callbacks?: SDK.RoomCallbacks

  public constructor(params?: WhiteWebSdkConfiguration) {
    super();

    this.whiteboardSDK = new SDK.WhiteWebSdk(params);
  }

  public joinRoom(params: JoinRoomParams, callbacks?: RoomCallbacks): Promise<Whiteboard> {

    this.uuid = params.uuid;
    this.roomToken = params.roomToken;
    this.userToken = params.userToken;
    this.disableOperations = params.disableOperations;

    if (callbacks) {
      this.callbacks = callbacks;
    }

    const _callbacks: SDK.RoomCallbacks = {
      onRoomStateChanged: this.onRoomStateChanged,
    }

    return this.whiteboardSDK.joinRoom(params, _callbacks).then((room: Room) => {
      this.room = room;
      return this;
    })
  }

  // callbacks

  public onPhaseChanged(phase: SDK.RoomPhase) {
    if (this.callbacks && this.callbacks.onPhaseChanged) {
      this.callbacks.onPhaseChanged(phase);
    }
  }

  public onRoomStateChanged(modifyState: Partial<SDK.RoomState>) {
    if (modifyState.globalState) {
      this.globalState = modifyState.globalState;
    }
    if (modifyState.memberState) {
      this.memberState = modifyState.memberState;
    }
    if (modifyState.sceneState) {
      this.sceneState = modifyState.sceneState;
    }
    if (modifyState.broadcastState) {
      this.broadcastState = modifyState.broadcastState;
    }

    if (this.callbacks && this.callbacks.onRoomStateChanged) {
      this.callbacks.onRoomStateChanged(modifyState);
    }
  }

  public onBeingAbleToCommitChange(isAbleToCommit: boolean){
    if (this.callbacks && this.callbacks.onBeingAbleToCommitChange) {
      this.callbacks.onBeingAbleToCommitChange(isAbleToCommit);
    }
  }

  public onDisconnectWithError(error: Error){
    if (this.callbacks && this.callbacks.onDisconnectWithError) {
      this.callbacks.onDisconnectWithError(error);
    }
  }

  public onKickedWithReason(reason: string){
    if (this.callbacks && this.callbacks.onKickedWithReason) {
      this.callbacks.onKickedWithReason(reason);
    }
  }

  public onSliceChanged(slice: string){
    if (this.callbacks && this.callbacks.onSliceChanged) {
      this.callbacks.onSliceChanged(slice);
    }
  }

  // room interface methods

  public async disconnect(){
    if (this.room === undefined) return;
    if (this.room.phase === SDK.RoomPhase.Connected) {
      // disconnect has a bug: cannot disconnect
      await this.room.disconnect();
      this.room = undefined;
    }
  }

  public setGlobalState(modifyState: Partial<SDK.GlobalState>) {
    if (this.room) {
      this.room.setGlobalState(modifyState);
    }
  }

  public setMemberState(modifyState: Partial<SDK.MemberState>) {
    if (this.room) {
      this.room.setMemberState(modifyState);

      this.memberState = Object.assign({}, this.memberState, modifyState);
    }
  }

  public setViewMode(viewMode: SDK.ViewMode){
    if (this.room)   {
      this.room.setViewMode(viewMode);
    }
  }

  public setScenePath(scenePath: string){
    if (this.room)   {
      this.room.setScenePath(scenePath);
    }
  }

  public putScenes(path: string, scenes: { name?: string; ppt?: SDK.PptDescription; }[], index?: number) {
    if (this.room) {
      this.room.putScenes(path, scenes, index);
    }
  }

  public removeScenes(path: string) {
    if (this.room) {
      this.room.removeScenes(path);
    }
  }

  public moveScene(originalPath: string, targetPath: string) {
    if (this.room) {
      this.room.moveScene(originalPath, targetPath);
    }
  }

  public insertImage(imageInfo: SDK.ImageInformation) {
    if (this.room) {
      this.room.insertImage(imageInfo);
    }
  }

  public completeImageUpload(uuid: string, src: string) {
    if (this.room) {
      this.room.completeImageUpload(uuid, src);
    }
  }

  public getMemberState(memberId: number): SDK.MemberState | null {
    if (this.room) {
      return this.room.memberState(memberId);
    }
    return null;
  }

  public zoomChange(scale: number): void {
    if (this.room) {
      this.room.zoomChange(scale);
    }
  }

  public bindHtmlElement(element: HTMLElement | null): void {
    if (this.room) {
      this.room.bindHtmlElement(element);
    }
  }

  public refreshViewSize(): void {
    if (this.room) {
      this.room.refreshViewSize();
    }
  }

  public screenshot(params: SDK.ScreenshotParam): Promise<Blob> | null {
    if (this.room) {
      return this.room.screenshot(params);
    }
    return null;
  }

}