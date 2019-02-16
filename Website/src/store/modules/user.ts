import { RootState } from './types'
import { Module } from 'vuex'
import { GetterTree, ActionTree, MutationTree  } from 'vuex'
import axios, { AxiosPromise } from 'axios'

import * as UserAPI from '@/api/user'
import { UserArgs, User } from '@/types/user';

export interface UserState {
  signedIn: boolean
  token: string
  user: User
}

const state: UserState = {
  signedIn: false,
  token: '',
  user: new User({id: 0, name: ''})
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
  },

  setUserInfo(state, info: User) {
    state.user = info
  }
}

const actions: ActionTree<UserState, RootState> = {

  fetchState({ commit }): AxiosPromise<UserState> {
    return UserAPI.State().then((res) => {
      commit('setUserSignedIn', res.data.signed_in)

      if (res.data.signed_in) {
        let info = new User(res.data)
        commit('setUserInfo', info);
      }

      return res
    })
  },

  autoCreateUser({ commit }, args: UserArgs): AxiosPromise<UserState> {
    return UserAPI.AutoCreate(args).then((res) => {
      commit('setUserSignedIn', true);
      commit('setUserToken', res.data.token);
      let info = new User(res.data)
      commit('setUserInfo', info);
      return res;
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
