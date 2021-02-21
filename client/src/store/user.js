export default {
  namespaced: true,
  state: {
    currentUser: null
  },
  mutations: {},
  actions: {
    async register({ dispatch, commit }, { email, password, name }) {
      try {
        const fp = await (await this._vm.$fingerprint).get()
        const result = await dispatch(
          'http/request',
          {
            url: '/api/user/register',
            method: 'POST',
            data: { email, password, name, fingerprint: fp.visitorId },
            headers: { 'Content-Type': 'application/json' }
          },
          { root: true }
        )
        console.log('result: ', result)
      } catch (error) {
        if (!error.sender) {
          error.sender = 'client'
          console.log('register error:', error)
        }
        if (!error.source) {
          error.source = 'store user register'
        }
        throw error
      }
    }
  }
}
