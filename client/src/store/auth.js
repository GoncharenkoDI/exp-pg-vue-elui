export default {
  namespaced: true,
  state: {
    accessToken: null, //{token = c093e09f-c100-470f-b24d-0ba96ce1a14f, userId, expiresIn}
    refreshToken: null //{token, expiresIn}
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
    }
  },
  actions: {
    async login({ dispatch, commit }, { email, password }) {
      try {
        commit('clearAccessToken')
        commit('clearRefreshToken')
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
          token: result.refreshToken,
          expiresIn: new Date(result.expiresIn)
        }
        commit('auth/setAccessToken', accessToken, { root: true })
        commit('auth/setRefreshToken', refreshToken, { root: true })
      } catch (error) {
        console.log('login error:', error)
        error.sender = error.sender || 'client'
        error.source = error.source || 'auth login'
        commit('setLoading', false)
        throw error
      }
    },
    async refreshToken({ dispatch, commit, state }) {
      const token = state.refreshToken.token
      try {
        commit('clearAccessToken')
        commit('clearRefreshToken')
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
        console.log('refreshToken', result)
      } catch (error) {
        console.log('refreshToken error:', error)
        error.sender = error.sender || 'client'
        error.source = error.source || 'auth refreshToken'
        commit('setLoading', false)
        throw error
      }
    },
    async getCurrentUser({ dispatch, commit }) {
      try {
        const result = await dispatch(
          'http/request',
          {
            url: '/api/auth/user',
            method: 'get'
          },
          { root: true }
        )
        console.log('getCurrentUser result', result)
      } catch (error) {
        console.log('getCurrentUser error', error)
      }
    }
  }
}
