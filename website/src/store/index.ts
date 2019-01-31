import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'

import { RootState } from './modules/types'
import { user } from './modules/user'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    version: 'v1.0.0'
  },
  modules: {
    user
  }
}

export default new Vuex.Store<RootState>(store)