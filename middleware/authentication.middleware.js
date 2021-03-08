/** процедура дійсності користувача в системі
 * @module authentication.middleware.js процедура дійсності користувача в системі
 */
const config = require('config')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const authorization = req.headers.authorization
    if (authorization) {
      const authToken = authorization.split(' ')[1] //Bearer authToken
      const jwtOptions = config.get('jwt')
      const tokenInfo = jwt.verify(authToken, jwtOptions.secret)
      const userId = tokenInfo.userId

      const user = await User.getUser(userId)
      if (Object.keys(user).length != 0) {
        req.currentUserId = userId
      }
    }
    next()
  } catch (error) {
    console.log('auth middleware error: ', error)
    next()
  }
}
