/** модуль, який обробляє звернення за маршрутом /api/test
 * @module user.routers.js модуль, який обробляє звернення за маршрутом /api/user
 */
const express = require('express')
const db = require('../db')
const config = require('config')

const jwt = require('jsonwebtoken')

const router = express.Router()
/**
 *@method GET
 * uri /api/test
 */
router.get('/', async (req, res) => {
  try {
    const sessionsId = [1, 2]
    const { rows } = await db.query(
      `SELECT * FROM test_table WHERE id in (${sessionsId.join()})`
    )

    res.send(JSON.stringify(rows))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
  }
})
/**
 *@method GET
 * uri /api/test/token
 */
router.get('/token', async (req, res) => {
  try {
    const jwtOptions = config.get('jwt')

    const token = jwt.sign(
      { userId: '0000-00000-0000-0000' },
      jwtOptions.secret,
      { expiresIn: jwtOptions.expiresIn }
    )
    const decode = jwt.verify(token, jwtOptions.secret)
    console.log('now', new Date(Date.now()))
    console.log('decode.iat', new Date(decode.iat * 1000))
    console.log('decode.exp', new Date(decode.exp * 1000))
    res.send(JSON.stringify({ token }))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
  }
})
/**
 *@method POST
 * uri /api/test/token
 */
router.post('/token', async (req, res) => {
  try {
    const jwtOptions = config.get('jwt')

    const { token } = req.body
    const decode = jwt.verify(token, jwtOptions.secret)
    console.log(decode)
    res.send(JSON.stringify({ decode }))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
  }
})
/**
 *@method GET
 * uri /api/test/id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM test_table WHERE id = $1', [
      id
    ])

    res.send(JSON.stringify(rows[0]))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, text } = req.body
    const { rowCount } = await db.update(
      'test_table',
      { title, text },
      'id = $3',
      [id]
    )

    res.send(JSON.stringify({ rowCount }))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify(error))
  }
})

module.exports = router
