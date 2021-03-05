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
      { dispatch, commit },
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
      const headers = {}
      try {
        /* якщо rootState.auth.accessToken 
        і rootState.auth.accessToken.token 
        і rootState.auth.accessToken.expiresIn > new Date(Date.now()  + 5 * 60 * 1000) за 5 хвилин ще не закінчиться
        то додаємо до авторизації rootState.auth.accessToken.token
        інакше
          очищуемо rootState.auth.accessToken
          якщо є діючий refreshToken 
            запитуємо нову пару tokens
            записуємо в state
            додаємо до авторизації rootState.auth.accessToken.token
          інакше
            очищуемо rootState.auth.refreshToken
         */
        if (
          rootState.auth.accessToken &&
          rootState.auth.accessToken.token &&
          rootState.auth.accessToken.expiresIn >
            new Date(Date.now() + 5 * 60 * 1000)
        ) {
          headers.Authorization = 'Bearer ' + rootState.auth.accessToken.token
          console.log(headers)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {}
}
