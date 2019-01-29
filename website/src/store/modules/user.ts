import { RootState } from './types';
import { Module } from 'vuex';
import { GetterTree, ActionTree, MutationTree  } from 'vuex';
import axios, { AxiosPromise } from 'axios';

import * as UserAPI from '@/api/user';

export interface UserState {
  signedIn: boolean
  firstName: string
  lastName: string
}

const state: UserState = {
  signedIn: false,
  firstName: '',
  lastName: '',
}

const getters: GetterTree<UserState, RootState> = {
  firstName(state) : string {
    return state.firstName
  },
  lastName(state) : string {
    return state.lastName
  }
}


const mutations: MutationTree<UserState> = {

  setUserSignedIn(state, signedIn: boolean) {
    state.signedIn = signedIn
  }

}

const actions: ActionTree<UserState, RootState> = {

  fetchState({ commit }): AxiosPromise<UserState> {
    return UserAPI.State().then(res => {
      commit('setUserSignedIn', res.data.signed_in)
      return res
    }).catch(err => {
      return err
    })
  }

}


const namespaced: boolean = true;

export const user: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};