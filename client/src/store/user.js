export default {
  namespaced: true,
  state: {
    currentUser: null
  },
  mutations: {
    setCurrentUser(state) {
      const accessToken = state.auth.accessToken
      if (accessToken && accessToken.token) {
      }
    },
    clearCurrentUser(state) {
      state.currentUser = null
    }
  },
  actions: {
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        commit('setCurrentUser')
        const fp = await (await this._vm.$fingerprint).get()
        const result = await dispatch(
          'http/request',
          {
            url: '/api/user/register',
            method: 'POST',
            data: { email, password, name, fingerprint: fp.visitorId },
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
        if (!error.sender) {
          error.sender = 'client'
          console.log('register error:', error)
        }
        if (!error.source) {
          error.source = 'store user register'
        }
        throw error
      }
    },
    async testUserByEmail({ dispatch }, { email }) {
      try {
        const response = await dispatch(
          'http/request',
          {
            // true | false
            url: `/api/user/test-email/${email}`
          },
          { root: true }
        )
        return response
      } catch (error) {
        console.log('testUserByEmail error:', error)
        throw error
      }
    }
  }
}
