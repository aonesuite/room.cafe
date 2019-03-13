import { Module } from 'vuex';
import { GetterTree, ActionTree, MutationTree  } from 'vuex';
import axios, { AxiosPromise } from 'axios';
import * as QNRTC from 'pili-rtc-web';

import * as WhiteBoardSdk from 'white-web-sdk';

import { RootState } from './types';
import * as RoomAPI from '@/api/room';
import { RoomArgs, RoomInfo } from '@/types/room';
import { RTCUser } from '@/types/user';
import { RTC } from '../../types/rtc';

const whiteboardSdk = new WhiteBoardSdk.WhiteWebSdk();

export interface RoomState {
  roomInfo: RoomInfo,
  RTC: RTC,
  RTCUsers: RTCUser[],
  StageStreamId: string,
  ChatPopUp: boolean,
  UnreadCount: number,
  Whiteboard: WhiteBoardSdk.Room,
}

const state: RoomState = {
  roomInfo: {} as RoomInfo,
  RTC: new RTC(),
  RTCUsers: [] as RTCUser[],
  StageStreamId: "",
  ChatPopUp: false,
  UnreadCount: 0,
  Whiteboard: {} as WhiteBoardSdk.Room,
}

const getters: GetterTree<RoomState, RootState> = {

}


const mutations: MutationTree<RoomState> = {

  setRoomInfo(state, info: RoomInfo) {
    state.roomInfo = info;
  },

  setRTCUsers(state, users: QNRTC.User[]) {
    for (const user of users) {
      state.RTCUsers.push(new RTCUser(user.userId, user.userData));
    }
  },

  setStageStreamId(stage, streamId: string) {
    stage.StageStreamId = streamId;
  },

  setChatPopUp(stage, popUp: boolean) {
    stage.ChatPopUp = popUp;
  },

  setUnreadCount(state, count) {
    state.UnreadCount = count
  },

  setWhiteBoard(state, room: WhiteBoardSdk.Room) {
    state.Whiteboard = room
  }
}

const actions: ActionTree<RoomState, RootState> = {

  createRoom({ commit }, args: RoomArgs): AxiosPromise<RoomState> {
    return RoomAPI.Create(args).then((res) => {
      commit('setRoomInfo', res.data as RoomInfo)
      return res
    })
  },

  getRoom({ commit }, uuid: string): AxiosPromise<RoomState> {
    return RoomAPI.Info(uuid).then((res) => {
      commit('setRoomInfo', res.data as RoomInfo)
      return res
    })
  },

  async joinRTCRoom({ state, commit }, {token, user}) {
    var users = await state.RTC.joinRoomWithToken(token, user);
    commit('setRTCUsers', users);
  },

  joinWhiteBoardRoom({ state, commit }, params: WhiteBoardSdk.JoinRoomParams, callbacks?: WhiteBoardSdk.RoomCallbacks): Promise<WhiteBoardSdk.Room> {
    return whiteboardSdk.joinRoom(params, callbacks).then((room) => {
      commit('setWhiteBoard', room);
      return room;
    })
  },
}


const namespaced: boolean = true

export const room: Module<RoomState, RootState> = {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
