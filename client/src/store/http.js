export default {
  namespaced: true,
  state: {
    loading: false
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async request(
      { dispatch, commit, rootState },
      { url, method = 'GET', data = {}, headers = {} }
    ) {
      commit('setLoading', true)
      try {
        let body
        if (Object.keys(data).length) {
          if (
            headers['Content-Type'] &&
            headers['Content-Type'] == 'application/json'
          ) {
            body = JSON.stringify(data)
          } else {
            body = data
          }
        }
        dispatch('beforeRequest')
        if (rootState.auth.accessToken && rootState.auth.accessToken.token) {
          headers.Authorization = 'Bearer ' + rootState.auth.accessToken.token
        }
        const response = await fetch(url, { method, body, headers })
        const result = await response.json()
        if (!response.ok) {
          const errorObj = new Error(result.message)
          errorObj.sender = 'api server'
          if (result.source) {
            errorObj.source = result.source
          } else {
            errorObj.source = `http error: ${response.statusText}`
          }
          throw errorObj
        }
        commit('setLoading', false)
        return result
      } catch (error) {
        console.log('request error:', error)
        if (!error.sender) {
          error.sender = 'client'
        }
        if (!error.source) {
          error.source = 'http request'
        }
        commit('setLoading', false)
        throw error
      }
    },
    async beforeRequest({ dispatch, commit, state, rootState }) {
      try {
        if (rootState.auth.refreshToken && rootState.auth.refreshToken.token) {
          if (rootState.auth.refreshToken.expiresIn < new Date(Date.now())) {
            if (
              !rootState.auth.accessToken ||
              !rootState.auth.accessToken.token ||
              rootState.auth.accessToken.expiresIn >
                new Date(Date.now() + 5 * 60 * 1000)
            ) {
              await dispatch(
                'auth/fetchRefreshToken',
                rootState.auth.refreshToken.token,
                { root: true }
              )
            }
          } else {
            commit('auth/clearRefreshToken', null, { root: true })
            commit('auth/clearAccessToken', null, { root: true })
          }
        } else {
          commit('auth/clearRefreshToken', null, { root: true })
          commit('auth/clearAccessToken', null, { root: true })
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {}
}
