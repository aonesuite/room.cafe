import { RootState } from './types'
import { Module } from 'vuex'
import { GetterTree, ActionTree, MutationTree  } from 'vuex'
import axios, { AxiosPromise } from 'axios'

import * as UserAPI from '@/api/user'
import { UserArgs } from '@/types/user';

export interface UserState {
  signedIn: boolean
  token: string
}

const state: UserState = {
  signedIn: false,
  token: ''
}

const getters: GetterTree<UserState, RootState> = {

}


const mutations: MutationTree<UserState> = {

  setUserSignedIn(state, signedIn: boolean) {
    state.signedIn = signedIn
  },

  setUserToken(state, token: string) {
    state.token = token
    localStorage.token = token
  }
}

const actions: ActionTree<UserState, RootState> = {

  fetchState({ commit }): AxiosPromise<UserState> {
    return UserAPI.State().then((res) => {
      commit('setUserSignedIn', res.data.signed_in)
      return res
    })
  },

  autoCreateUser({ commit }, args: UserArgs): AxiosPromise<UserState> {
    return UserAPI.AutoCreate(args).then((res) => {
      commit('setUserToken', res.data.token)
      return res
    })
  }

}


const namespaced: boolean = true

export const user: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
