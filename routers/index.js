const user = require('./user.routers')
const auth = require('./auth.routers')
const test = require('./test.routers')

module.exports = (app) => {
  app.use('/api/user', user)
  app.use('/api/auth', auth)
  app.use('/api/test', test)
  // etc..
}
