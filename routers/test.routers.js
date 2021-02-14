/** модуль, який обробляє звернення за маршрутом /api/test
 * @module user.routers.js модуль, який обробляє звернення за маршрутом /api/user
 */
const express = require('express')
const db = require('../db')

const router = express.Router()
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
