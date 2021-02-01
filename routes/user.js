const { json } = require('express')
const express = require('express')
const db = require('../db')

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    //отримати з req.body {email, password, }
    const { email, password } = req.body
    const result = await db.insert('users', { email, password }, 'uuid,')
    console.log('result', result)
    res.send(JSON.stringify({}))
  } catch (error) {
    console.log(error)
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
