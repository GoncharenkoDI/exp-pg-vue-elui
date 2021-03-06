import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import http from './http'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    http,
    user
  }
})
