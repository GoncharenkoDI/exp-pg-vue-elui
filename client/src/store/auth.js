export default {
  namespaced: true,
  state: {
    currentUser: null
  },
  mutations: {},
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
