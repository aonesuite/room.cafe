import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

import { RootState } from './modules/types'
import { user } from './modules/user'
import { room } from './modules/room'
import { uploader } from './modules/uploader'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    version: 'v1.0.0'
  },
  modules: {
    user,
    room,
    uploader
  }
}

export default new Vuex.Store<RootState>(store)