import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

import { RootState } from './modules/types'
import { user } from './modules/user'
import { room } from './modules/room'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    version: 'v1.0.0'
  },
  modules: {
    user,
    room
  }
}

export default new Vuex.Store<RootState>(store)