import { Module } from 'vuex';
import { GetterTree, ActionTree, MutationTree  } from 'vuex';
import axios, { AxiosPromise } from 'axios';
import * as QNRTC from 'pili-rtc-web';

import { RootState } from './types';
import * as RoomAPI from '@/api/room';
import { RoomArgs, RoomInfo } from '@/types/room';
import { Stream } from '@/types/stream';
import { RTCUser } from '@/types/user';
import { RTC } from '../../types/rtc';

export interface RoomState {
  roomInfo: RoomInfo,
  RTC: RTC,
  RTCUsers: RTCUser[],
  Streams: Stream[],
}

const state: RoomState = {
  roomInfo: {} as RoomInfo,
  RTC: new RTC(),
  RTCUsers: [] as RTCUser[],
  Streams: [] as Stream[],
}

const getters: GetterTree<RoomState, RootState> = {

}


const mutations: MutationTree<RoomState> = {

  setRoomInfo(state, info: RoomInfo) {
    state.roomInfo = info
  },

  setRTCUsers(state, users: QNRTC.User[]) {
    for (const user of users) {
      state.RTCUsers.push(new RTCUser(user.userId, user.userData))
    }
  },
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

  async joinRTCRoom({ state, commit }, {token, userData}) {
    var users = await state.RTC.joinRoomWithToken(token, userData);
    commit('setRTCUsers', users);

    state.RTC.on("track-add", (tracks: QNRTC.Track[]) => {
      // console.log("new tracks", tracks);
    })

    state.RTC.on("user-join", (user: QNRTC.User) => {
      // eslint-disable-next-line
      console.log("new user!", user);
      /* eslint-disable */
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
