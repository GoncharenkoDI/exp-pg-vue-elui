export default {
  state: {},
  mutations: {},
  actions: {
    request({ dispatch, commit }, { url, method = 'GET', data, headers = {} }) {
      try {
        console.log(url)
      } catch (error) {
        console.log('request error:', error)
      }
    }
  },
  modules: {}
}
