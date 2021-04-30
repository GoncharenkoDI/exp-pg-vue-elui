const express = require('express')
const db = require('../db')
const config = require('config')
const User = require('../models/User')
const Session = require('../models/Session')
const jwt = require('jsonwebtoken')

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
    const jwtOptions = config.get('jwt')
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
      console.log('POST /api/auth/login error: ', error)
    }
    res.status(500).send(
      JSON.stringify({
        message: error.message || 'Невідома помилка',
        sender: error.sender || 'server',
        source: error.source || 'POST /api/auth/login'
      })
    )
  }
})
/** Оновлення токенів на підставі refresh-token
 * @method PUT
 * @uri /api/auth/token
 * @param { token, fingerprint } req.body
 * @returns  status = 200 { accessToken, refreshToken, expiresIn, user } || status = 500 { message, sender, source}
 */
router.put('/token', async (req, res) => {
  try {
    const { token, fingerprint } = req.body
    const jwtOptions = config.get('jwt')
    const ip = req.ip
    const ua = req.get('User-Agent')
    // видалити протерміновані сесії
    await Session.deleteOldSessions()
    /**
     * @description перевірити токен (за токеном, ip, fp), якщо немає 404 статус
     * @constant {id, user_id, refresh_token, user_agent, fingerprint, ip, expires_in, create_at, update_at} session
     */
    const session = await Session.getSession({ token, ip, ua, fingerprint })
    if (Object.keys(session).length === 0) {
      res.status(404).send(
        JSON.stringify({
          message: 'Токен з вказаними параметрами не знайдений.',
          sender: error.sender || 'server',
          source: error.source || 'PUT /api/user/token'
        })
      )
    }
    // в знайденій сесії згенерувати новий токен та термін дії,
    const { refreshToken, expiresIn } = await Session.updateSession(session.id)
    // згенерувати новий access-token за id користувача,
    const accessToken = jwt.sign(
      { userId: session.user_id },
      jwtOptions.secret,
      {
        expiresIn: jwtOptions.expiresIn
      }
    )
    // отримати інформацію про користувача
    const user = await User.getUser(session.user_id)
    // повернути refresh-token, термін дії, access-token,  інформацію про користувача
    res
      .status(200)
      .send(JSON.stringify({ accessToken, refreshToken, expiresIn, user }))
  } catch (error) {
    if (!error.sender) {
      console.log('PUT /api/user/token error: ', error)
    }
    res.status(500).send(
      JSON.stringify({
        message: error.message || 'Невідома помилка',
        sender: error.sender || 'server',
        source: error.source || 'PUT /api/user/token'
      })
    )
  }
})
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
      console.log('GET /api/auth/user error: ', error)
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
