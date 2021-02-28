export default {
  namespaced: true,
  state: {
    accessToken: null, //{token, userId, expiresIn}
    refreshToken: null //{token, expiresIn}
  },
  mutations: {
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken
      if (refreshToken && Object.keys(refreshToken).length) {
        localStorage.setItem('refreshToken', JSON.stringify(refreshToken))
      } else {
        localStorage.removeItem('refreshToken')
      }
    }
  },
  actions: {
    login({ dispatch, commit }, { email, password }) {
      try {
        dispatch(
          'http/request',
          {
            url: '/api/auth/login',
            method: 'POST',
            data: {
              email,
              password
            },
            headers: {
              'Content-type': 'application/json'
            }
          },
          {
            root: true
          }
        )
      } catch (error) {
        console.log('login error', error)
        throw error
      }
    }
  }
}
