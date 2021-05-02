/** модуль, який обробляє звернення за маршрутом /api/user
 * @module user.routers.js
 */
//const { json } = require('express')
const express = require('express')
const db = require('../db')
const config = require('config')
const User = require('../models/User')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = express.Router()

/** реєстрація нового користувача
 * @method POST
 * @uri /api/user/register
 * @params { email, password, name, fingerprint } = req.body
 * @return status = 201 { accessToken, refreshToken, expiresIn } || status = 500 { message, sender, source}
 */
router.post('/register', async (req, res) => {
  try {
    //отримати з req.body {email, password,name, fingerprint }
    //
    // eslint-disable-next-line no-unused-vars
    const { email, password, name, fingerprint } = req.body
    const jwtOptions = config.get('jwt')
    const ip = req.ip
    const ua = req.get('User-Agent')

    const { userId, refreshToken, expiresIn } = await User.addUser(
      { email, password, name },
      { ip, ua, fingerprint }
    )

    const accessToken = jwt.sign({ userId: userId }, jwtOptions.secret, {
      expiresIn: jwtOptions.expiresIn
    })
    /**
     * @constant { userId, email, user_name, last_login, login_state, session_id, token, create_at, update_at } user
     */
    const user = User.getUser(userId)
    // повертається res.status(200).send(JSON.stringify({ accessToken, refreshToken, expiresIn }))
    res.status(200).send(
      JSON.stringify({
        accessToken,
        refreshToken: { token: refreshToken, expiresIn: expiresIn },
        user
      })
    )
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

/** Перелік всіх користувачів
 * @method GET
 * @uri /api/user/
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users', [])
    res.send(JSON.stringify(rows))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
  }
})

/** інформація про користувача за id
 * @method GET
 * @uri /api/user/id
 * @returns { userId, email, user_name, last_login, login_state, session_id, token, create_at, update_at } user
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.getUser(id)
    if (Object.keys(user).length === 0) {
      res.status(404).send(
        JSON.stringify({
          message: `Користувач з id = ${id} не знайдено.`,
          sender: 'api server',
          source: 'GET /api/user/id'
        })
      )
      return
    }
    res.send(JSON.stringify(user))
  } catch (error) {
    if (!error.sender) {
      console.log('GET /api/user/id error', error)
    }
    res.status(500).send(
      JSON.stringify({
        message: error.message,
        sender: error.sender || 'api server',
        source: error.source || 'GET /api/user/id'
      })
    )
  }
})

/** видалення інформації про користувача за id
 *@method delete
 * @uri /api/user/id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id])
    if (rowCount === 0) {
      const deleteError = new Error(`Видалення запису з id ${id} не відбулося.`)
      deleteError.sender = 'server'
      deleteError.source = 'DELETE /api/user/id'
      throw deleteError
    }
    res.send(JSON.stringify(true))
  } catch (error) {
    if (!error.sender) {
      console.log('DELETE /api/user/id error: ', error)
    }
    const resObj = {
      message: error.message || 'Невідома помилка',
      sender: error.sender || 'server',
      source: error.source || 'DELETE /api/user/id'
    }
    res.status(500).send(JSON.stringify(resObj))
  }
})
/** отримання інформації про наявність користувача з вказаним email
 *@method get
 * @uri /api/user/test-email/${email}
 */
router.get('/test-email/:email', async (req, res) => {
  try {
    const { email } = req.params
    const result = await User.checkUserByEmail(email)
    res.send(JSON.stringify(result))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
  }
})

module.exports = router
