const express = require('express')
const db = require('../db')
const User = require('../models/User')
const Sessions = require('../models/Session')
const Session = require('../models/Session')

const router = express.Router()

/** Процедура входу користувача
 * @method POST
 * @uri /api/auth/login
 * @param { email, password, fingerprint } req.body
 * @returns { accessToken, refreshToken, expiresIn } || status = 500 { message, sender, source} status = 201
 */
router.post('/login', async (req, res) => {
  try {
    //отримати з req.body {email, password, }
    const { email, password, fingerprint } = req.body
    const ip = req.ip
    const ua = req.get('User-Agent')
    // Знайти користувача за email та паролем
    const userId = await User.testUser(email, password)
    // якщо знайдено то повертає userId, інакше повертається статус 404
    if (userId === null) {
      res.status(404).send(
        JSON.stringify({
          message: `Користувач з таким email та паролем не знайдено.`,
          sender: 'api server',
          source: 'POST /api/auth/login'
        })
      )
      return
    }
    // оновлюється сесія передається { userId, ip, ua, fingerprint } повертається { refreshToken, expiresIn }
    const { refreshToken, expiresIn } = await Session.newSession({
      userId,
      ip,
      ua,
      fingerprint
    })
    // формується новий accessToken = jwt.sign({ userId: userId }, jwtOptions.secret, { expiresIn: jwtOptions.expiresIn })
    const accessToken = jwt.sign({ userId: userId }, jwtOptions.secret, {
      expiresIn: jwtOptions.expiresIn
    })
    // повертається res.status(200).send(JSON.stringify({ accessToken, refreshToken, expiresIn }))
    res
      .status(200)
      .send(JSON.stringify({ accessToken, refreshToken, expiresIn }))
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
