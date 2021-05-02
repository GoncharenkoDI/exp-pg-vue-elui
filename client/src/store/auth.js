export default {
  namespaced: true,
  state: {
    accessToken: null, //{token = c093e09f-c100-470f-b24d-0ba96ce1a14f, userId, expiresIn}
    refreshToken: null, //{token, expiresIn}
    currentUser: null
  },
  getters: {
    hasAccessToken(state) {
      return !(state.accessToken === null)
    }
  },
  mutations: {
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken
    },
    clearAccessToken(state) {
      state.accessToken = null
    },
    setRefreshToken(state, refreshToken) {
      if (refreshToken && Object.keys(refreshToken).length) {
        state.refreshToken = refreshToken
        localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
      } else {
        state.refreshToken = null
        localStorage.removeItem('refreshToken')
      }
    },
    clearRefreshToken(state) {
      state.refreshToken = null
      localStorage.removeItem('refreshToken')
    },
    setCurrentUser(state, user) {
      state.currentUser = user
    },
    clearCurrentUser(state) {
      state.currentUser = null
    }
  },
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      try {
        commit('auth/clearAccessToken', null, { root: true })
        commit('auth/clearRefreshToken', null, { root: true })
        commit('auth/clearCurrentUser', null, { root: true })
        const fp = await (await this._vm.$fingerprint).get()
        const result = await dispatch(
          'http/request',
          {
            url: '/api/auth/login',
            method: 'POST',
            data: { email, password, fingerprint: fp.visitorId },
            headers: { 'Content-Type': 'application/json' }
          },
          { root: true }
        )
        const accessToken = {
          token: result.accessToken,
          userId: JSON.parse(atob(result.accessToken.split('.')[1])).userId,
          expiresIn: new Date(
            JSON.parse(atob(result.accessToken.split('.')[1])).exp * 1000
          )
        }
        const refreshToken = {
          token: result.refreshToken.token,
          expiresIn: new Date(result.refreshToken.expiresIn)
        }
        const user = result.user
        commit('auth/setAccessToken', accessToken, { root: true })
        commit('auth/setRefreshToken', refreshToken, { root: true })
        commit('auth/setCurrentUser', user, { root: true })
      } catch (error) {
        if (!error.sender) {
          error.sender = 'client'
          console.log('auth login error:', error)
        }
        error.sender = error.sender || 'client'
        error.source = error.source || 'auth login'
        throw error
      }
    },

    async refreshToken({ dispatch, commit, state }) {
      if (!state.refreshToken || !state.refreshToken.token) {
        return
      }

      const token = state.refreshToken.token
      try {
        commit('auth/clearAccessToken', null, { root: true })
        commit('auth/clearRefreshToken', null, { root: true })
        commit('auth/clearCurrentUser', null, { root: true })
        const fp = await (await this._vm.$fingerprint).get()
        const result = await dispatch(
          'http/request',
          {
            url: '/api/auth/token',
            method: 'put',
            data: { token, fingerprint: fp.visitorId },
            headers: { 'Content-Type': 'application/json' }
          },
          { root: true }
        )
        const accessToken = {
          token: result.accessToken,
          userId: JSON.parse(atob(result.accessToken.split('.')[1])).userId,
          expiresIn: new Date(
            JSON.parse(atob(result.accessToken.split('.')[1])).exp * 1000
          )
        }
        const refreshToken = {
          token: result.refreshToken.token,
          expiresIn: new Date(result.refreshToken.expiresIn)
        }
        const user = result.user
        commit('auth/setAccessToken', accessToken, { root: true })
        commit('auth/setRefreshToken', refreshToken, { root: true })
        commit('auth/setCurrentUser', user, { root: true })
      } catch (error) {
        console.log('refreshToken error:', error)
        error.sender = error.sender || 'client'
        error.source = error.source || 'auth refreshToken'
        throw error
      }
    },
    /**
     *
     * @param {*} param0
     */
    async getCurrentUser({ dispatch, commit }) {
      try {
        const user = await dispatch(
          'http/request',
          {
            url: '/api/auth/user',
            method: 'get'
          },
          { root: true }
        )
        if (Object.keys(user).length) {
          commit('auth/setCurrentUser', user, { root: true })
        } else {
          commit('auth/clearCurrentUser', null, { root: true })
        }
      } catch (error) {
        console.log('getCurrentUser error', error)
      }
    }
  }
}
