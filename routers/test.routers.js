/** модуль, який обробляє звернення за маршрутом /api/test
 * @module user.routers.js модуль, який обробляє звернення за маршрутом /api/user
 */
const express = require('express')
const db = require('../db')

const router = express.Router()
/**
 *@method GET
 * uri /api/test
 */
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM test_table', [])

    res.send(JSON.stringify(rows[0]))
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
