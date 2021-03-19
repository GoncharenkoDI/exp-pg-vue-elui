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
      commit('http/setLoading', true, { root: true })
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

        await dispatch('http/beforeRequest', null, { root: true })
        if (rootState.auth.accessToken && rootState.auth.accessToken.token) {
          headers.Authorization = 'Bearer ' + rootState.auth.accessToken.token
        }
        const response = await fetch(url, { method, body, headers })
        const result = await response.json()
        if (!response.ok) {
          const errorObj = new Error(result.message)
          errorObj.sender = 'api server (request)'
          if (result.source) {
            errorObj.source = result.source
          } else {
            errorObj.source = `http error (request): ${response.statusText}`
          }
          throw errorObj
        }
        commit('http/setLoading', false, { root: true })
        return result
      } catch (error) {
        console.log('request error:', error)
        if (!error.sender) {
          error.sender = 'client'
        }
        if (!error.source) {
          error.source = 'http request'
        }
        commit('http/setLoading', false, { root: true })
        throw error
      }
    },
    async beforeRequest({ dispatch, commit, state, rootState }) {
      try {
        if (rootState.auth.refreshToken && rootState.auth.refreshToken.token) {
          if (rootState.auth.refreshToken.expiresIn > new Date(Date.now())) {
            if (
              !rootState.auth.accessToken ||
              !rootState.auth.accessToken.token ||
              rootState.auth.accessToken.expiresIn <
                new Date(Date.now() + 5 * 60 * 1000)
            ) {
              commit('auth/clearAccessToken', null, { root: true })
              const headers = {
                'Content-Type': 'application/json'
              }
              const fp = await (await this._vm.$fingerprint).get()
              const body = JSON.stringify({
                token: rootState.auth.refreshToken.token,
                fingerprint: fp.visitorId
              })
              commit('auth/clearRefreshToken', null, { root: true })
              const response = await fetch('/api/auth/token', {
                method: 'PUT',
                body,
                headers
              })
              //status = 200 { accessToken, refreshToken, expiresIn, user }
              const result = await response.json()
              if (!response.ok) {
                const errorObj = new Error(result.message)
                errorObj.sender = result.sender || 'api server (beforeRequest)'
                errorObj.source =
                  result.source ||
                  `http error (beforeRequest): ${response.statusText}`
                throw errorObj
              }
              const accessToken = {
                token: result.accessToken,
                userId: JSON.parse(atob(result.accessToken.split('.')[1]))
                  .userId,
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
              commit('auth/setCurrentUser', result.user, { root: true })
            }
          } else {
            commit('auth/clearRefreshToken', null, { root: true })
            commit('auth/clearAccessToken', null, { root: true })
            commit('auth/clearCurrentUser', null, { root: true })
          }
        } else {
          commit('auth/clearRefreshToken', null, { root: true })
          commit('auth/clearAccessToken', null, { root: true })
          commit('auth/clearCurrentUser', null, { root: true })
        }
        return
      } catch (error) {
        commit('auth/clearRefreshToken', null, { root: true })
        commit('auth/clearAccessToken', null, { root: true })
        commit('auth/clearCurrentUser', null, { root: true })
        console.log(error)
      }
    }
  },
  modules: {}
}
