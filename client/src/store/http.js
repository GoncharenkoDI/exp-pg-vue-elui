export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async request(
      { dispatch, commit },
      { url, method = 'GET', data, headers = {} }
    ) {
      try {
        let body = JSON.stringify({})
        if (data) {
          body = JSON.stringify(data)
        }

        const response = await fetch(url, { method, body, headers })
        const result = await response.json()
        if (!response.ok) {
          const httpError = new Error(result.message)
          httpError.type = 'http error'
          httpError.status = response.status
          throw httpError
        }
        return result
      } catch (error) {
        console.log('request error:', error)
        throw error
      }
    }
  },
  modules: {}
}
