export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async request(
      { dispatch, commit },
      { url, method = 'GET', data = {}, headers = {} }
    ) {
      try {
        if (
          data &&
          headers['Content-Type'] &&
          headers['Content-Type'] == 'application/json'
        ) {
          const body = JSON.stringify(data)
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
        return result
      } catch (error) {
        console.log('request error:', error)
        if (!error.sender) {
          error.sender = 'client'
        }
        if (!error.source) {
          error.source = 'http request'
        }
        throw error
      }
    }
  },
  modules: {}
}
