export default {
  namespaced: true,
  state: {
    loading: false
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading
      console.log('loading', loading)
    }
  },
  actions: {
    async request(
      { dispatch, commit },
      { url, method = 'GET', data = {}, headers = {} }
    ) {
      commit('setLoading', true)
      try {
        let body = data
        if (
          data &&
          headers['Content-Type'] &&
          headers['Content-Type'] == 'application/json'
        ) {
          body = JSON.stringify(data)
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
    }
  },
  modules: {}
}
