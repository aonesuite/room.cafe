import { Module } from 'vuex'
import { GetterTree, ActionTree, MutationTree  } from 'vuex'
import axios, { AxiosPromise } from 'axios'
import * as QNRTC from 'pili-rtc-web'

import { RootState } from './types'
import * as RoomAPI from '@/api/room'
import { RoomArgs, RoomInfo } from '@/types/room';

export interface RoomState {
  roomInfo: RoomInfo,
  RTC: QNRTC.TrackModeSession,
}

const state: RoomState = {
  roomInfo: {} as RoomInfo,
  RTC: new QNRTC.TrackModeSession(),
}

const getters: GetterTree<RoomState, RootState> = {

}


const mutations: MutationTree<RoomState> = {

  setRoomInfo(state, info: RoomInfo) {
    state.roomInfo = info
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

  async joinRTCRoom({ state, commit }, token) {
    await state.RTC.joinRoomWithToken(token)
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
