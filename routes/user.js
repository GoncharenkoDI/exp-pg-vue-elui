const { json } = require('express')
const express = require('express')
const db = require('../db')

const router = express.Router()

/**
 * реєстрація нового користувача
 * method POST
 * uri /api/user/register
 *
 */
router.post('/register', async (req, res) => {
  try {
    //отримати з req.body {email, password,name }
    const { email, password, name } = req.body
    const result = await db.insert('users', { email, password }, 'id,')
    console.log('result', result)
    res.send(JSON.stringify({ uuid: result, email, password }))
  } catch (error) {
    console.log('POST /api/user/register error: ', error)
    res.status(500).send(JSON.stringify(error))
  }
})

/**
 *
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

module.exports = router
