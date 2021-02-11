export default {
  namespaced: true,
  state: {
    currentUser: null
  },
  mutations: {},
  actions: {
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        await dispatch(
          'http/request',
          {
            url: '/api/user/register',
            method: 'POST',
            data: { email, password, name },
            headers: { 'Content-Type': 'application/json' }
          },
          { root: true }
        )
      } catch (error) {
        console.log('store register error', error)
        throw error
      }
    }
  }
}
