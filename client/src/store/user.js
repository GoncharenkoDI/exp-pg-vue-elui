export default {
  namespaced: true,
  state: {
    currentUser: null
  },
  mutations: {},
  actions: {
    register({ dispatch, commit }, { email, password, name }) {
      try {
        dispatch(
          'http/request',
          {
            url: '/api/users/register',
            method: 'POST',
            data: {
              email,
              password,
              name
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
        console.log('register error', error)
        throw error
      }
    }
  }
}
