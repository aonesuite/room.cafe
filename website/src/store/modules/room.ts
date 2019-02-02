import { Module } from 'vuex'
import { GetterTree, ActionTree, MutationTree  } from 'vuex'
import axios, { AxiosPromise } from 'axios'

import { RootState } from './types'
import * as UserAPI from '@/api/user'
import { RoomArgs, RoomInfo } from '@/types/room';

export interface RoomState {
  RoomInfo: RoomInfo
}

const state: RoomState = {
  RoomInfo: {} as RoomInfo,
}

const getters: GetterTree<RoomState, RootState> = {

}


const mutations: MutationTree<RoomState> = {

  setRoomInfo(state, info: RoomInfo) {
    state.RoomInfo = info
  }
}

const actions: ActionTree<RoomState, RootState> = {

  create({ commit }, args: RoomArgs): AxiosPromise<RoomState> {
    return UserAPI.AutoCreate(args).then((res) => {
      commit('setRoomInfo', res.data as RoomInfo)
      return res
    })
  }

}


const namespaced: boolean = true

export const room: Module<RoomState, RootState> = {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
