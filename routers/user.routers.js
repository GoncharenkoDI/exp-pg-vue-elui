/** модуль, який обробляє звернення за маршрутом /api/user
 * @module user.routers.js
 */
//const { json } = require('express')
const express = require('express')
const db = require('../db')
const config = require('config')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = express.Router()

/** реєстрація нового користувача
 * @method POST
 * @uri /api/user/register
 * @params { email, password, name, fingerprint } = req.body
 * @return status = 201 { uuid, email } || status = 500 { message, sender, source}
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

    // створити access-token

    // записати в межах одної транзакції
    let result
    let message
    let registerError
    let refreshToken
    let userId
    const client = await db.getClient()
    try {
      await db.startTransaction(client)
      const saltRounds = +config.get('bcrypt').saltRounds
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      // створити запис в таблиці users { email, password} отримати uuid як userId
      result = await db.clientInsert(
        client,
        'users',
        { email, password: hashedPassword },
        'id'
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось створити користувача.'
        console.log('register error: ', message)
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'POST /api/user/register error'
        throw registerError
      }
      userId = result.rows[0].id
      // створити запис в таблиці auth_assignment {user_id, item_name: 'public' }
      result = await db.clientInsert(
        client,
        'auth_assignment',
        { user_id: userId, item_name: 'user' },
        'item_name'
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось надати користувачеві початкові повноваження.'
        console.log('register error: ', message)
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'POST /api/user/register error'
        throw registerError
      }
      // видалити протерміновані сесії delete from public.refreshsessions where expires_in < CURRENT_TIMESTAMP
      await db.clientQuery(
        client,
        'DELETE FROM public.refreshsessions WHERE expires_in < CURRENT_TIMESTAMP'
      )
      // створити нову сесію в таблиці refreshsessions expires_in - 8 годин
      // {user_id,  user_agent: ua, fingerprint, ip,  expires_in: new Date(Date.now() + 8*3600000)} отримати refresh_token
      result = await db.clientInsert(
        client,
        'refreshsessions',
        {
          user_id: userId,
          user_agent: ua,
          fingerprint,
          ip,
          expires_in: new Date(Date.now() + 8 * 3600000)
        },
        'refresh_token'
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось створити користувача.'
        console.log('register error: ', message)
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'POST /api/user/register error'
        throw registerError
      }
      refreshToken = result.rows[0].refresh_token
      await db.commitTransaction(client)
    } catch (error) {
      await db.rollbackTransaction(client)
      throw error
    } finally {
      client.release()
    }

    const accessToken = jwt.sign({ userId: userId }, jwtOptions.secret, {
      expiresIn: jwtOptions.expiresIn
    })

    res.status(201).send(JSON.stringify({ accessToken, refreshToken }))
  } catch (error) {
    if (!error.sender) {
      console.log('POST /api/user/register error: ', error)
    }
    const resObj = {
      message: error.message || 'Невідома помилка',
      sender: error.sender || 'server',
      source: error.source || 'POST /api/user/register'
    }
    res.status(500).send(JSON.stringify(resObj))
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
 *@method GET
 * @uri /api/user/id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])

    res.send(JSON.stringify(rows[0]))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
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

module.exports = router
