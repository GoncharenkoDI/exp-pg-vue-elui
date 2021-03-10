const express = require('express')
const db = require('../db')
const User = require('../models/User')

const router = express.Router()

/** Процедура входу користувача
 * @method POST
 * @uri /api/auth/login
 * @param { email, password } req.body
 * @returns { accessToken, refreshToken, expiresIn } || status = 500 { message, sender, source} status = 201
 */
router.post('/login', async (req, res) => {
  try {
    //отримати з req.body {email, password, }
    const { email, password } = req.body
    res.send(JSON.stringify({ email, password }))
  } catch (error) {
    if (!error.sender) {
      console.log('POST /api/user/register error: ', error)
    }
    res.status(500).send(
      JSON.stringify({
        message: error.message || 'Невідома помилка',
        sender: error.sender || 'server',
        source: error.source || 'POST /api/user/register'
      })
    )
  }
})
/**
 * @method PUT
 * @uri /api/auth/token
 * @param { token, fingerprint } req.body
 * @returns { accessToken, refreshToken, expiresIn } || status = 500 { message, sender, source} status = 201
 */
router.put('/token', async (req, res) => {})
/**
 * @method GET
 * @uri /api/auth/user
 * @returns  status = 201 {  } || status = 500 { message, sender, source}
 */
router.get('/user', async (req, res) => {
  try {
    let user
    if (req.currentUserId) {
      console.log('req.currentUserId', req.currentUserId)
      user = await User.getUser(req.currentUserId)
    } else {
      console.log('no req.currentUserId')
      user = {}
    }
    res.send(JSON.stringify(user))
  } catch (error) {
    if (!error.sender) {
      console.log('POST /api/user/register error: ', error)
    }
    res.status(500).send(
      JSON.stringify({
        message: error.message || 'Невідома помилка',
        sender: error.sender || 'server',
        source: error.source || 'GET /api/auth/user'
      })
    )
  }
})

module.exports = router
