export default {
  state: {
    currentUser: null
  },
  mutations: {},
  actions: {
    login({ dispatch, commit }, { email, password }) {
      try {
        dispatch('request', {
          url: '/api/auth/login',
          method: 'POST',
          data: {
            email,
            password
          },
          headers: {
            'Content-type': 'application/json'
          }
        })
      } catch (error) {
        console.log('login error', error)
        throw error
      }
    }
  }
}
