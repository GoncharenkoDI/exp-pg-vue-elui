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
        console.log('data', data)
        console.log('headers.Content-Type', headers['Content-Type'])
        let body = {}
        if (
          data &&
          headers['Content-Type'] &&
          headers['Content-Type'] == 'application/json'
        ) {
          body = JSON.stringify(data)
          console.log(body)
        }

        const response = await fetch(url, { method, body, headers })
        const result = await response.json()
        if (!response.ok) {
          console.log('httpError')
          console.log('http result', result.message)

          throw new Error('http error')
        }
        return result
      } catch (error) {
        console.log('request error:', error)
        console.log('request error type:', error.type)
        throw error
      }
    }
  },
  modules: {}
}
