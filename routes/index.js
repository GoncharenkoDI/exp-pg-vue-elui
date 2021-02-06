const user = require('./user')
const auth = require('./auth')

module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/auth', auth)
  // etc..
}
