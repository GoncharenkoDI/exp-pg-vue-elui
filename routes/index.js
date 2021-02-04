const users = require('./user')
const auth = require('./auth')

module.exports = (app) => {
  app.use('/api/users', users)
  app.use('/api/auth', auth)
  // etc..
}
