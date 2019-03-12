import { RootState } from './types'
import { Module } from 'vuex'
import { GetterTree, ActionTree, MutationTree  } from 'vuex'

import axios, { AxiosPromise } from 'axios';

import * as API from '@/api/uploader'

export interface UploaderState {
  expireAt: number,
  token: string,
  domain: string,
}

const state: UploaderState = {
  expireAt: 0,
  token: "",
  domain: "",
}

const getters: GetterTree<UploaderState, RootState> = {

}

const mutations: MutationTree<UploaderState> = {

  setToken(state, token: UploaderState) {
    state.expireAt = token.expireAt
    state.token = token.token
    state.domain = token.domain
  },
}

const actions: ActionTree<UploaderState, RootState> = {

  getToken({ commit, state }): any {
    if (+new Date() + 60 * 10 * 1000 - state.expireAt * 1000 <= 0) {
      return
    }

    return API.getToken().then((res) => {
      commit('setToken', res.data as UploaderState)
      return res
    })
  }
}

const namespaced: boolean = true

export const uploader: Module<UploaderState, RootState> = {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
