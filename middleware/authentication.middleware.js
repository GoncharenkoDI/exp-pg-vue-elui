/** процедура дійсності користувача в системі
 * @module authentication.middleware.js процедура дійсності користувача в системі
 */
const config = require('config')
const User = require('../models/User')
module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const authorization = req.headers.authorization
    if (authorization) {
      const uuid = authorization.split(' ')[1] //Bearer uuid
      const user = await User.getUser(uuid)
      if (Object.keys(user).length != 0) {
        req.currentUser = uuid
      }
    }
    next()
  } catch (error) {
    console.log('auth middleware error: ', error)
    next()
  }
}
