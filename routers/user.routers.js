/** модуль, який обробляє звернення за маршрутом /api/user
 * @module user.routers.js
 */
//const { json } = require('express')
const express = require('express')
const db = require('../db')

const router = express.Router()

/** реєстрація нового користувача
 * @method POST
 * @uri /api/user/register
 * @return status = 201 { uuid, email } || status = 500 { message, sender, source}
 */
router.post('/register', async (req, res) => {
  try {
    //отримати з req.body {email, password,name, fingerprint }
    //
    // eslint-disable-next-line no-unused-vars
    const { email, password, name, fingerprint } = req.body
    // записати в межах одної транзакції
    // створити запис в таблиці users { email, password} отримати uuid
    // створити запис в таблиці auth_assignment {user_id: uuid, item_name: 'public' }
    // ip = req.ip
    // ua = req.get('User-Agent')
    /*user_id uuid NOT NULL,
    refresh_token uuid NOT NULL,
    user_agent character varying(200) COLLATE pg_catalog."default" NOT NULL,
    fingerprint character varying(200) COLLATE pg_catalog."default" NOT NULL,
    ip character varying(15) COLLATE pg_catalog."default" NOT NULL,
    expires_in */
    // видалити протерміновані сесії delete from public.refreshsessions where expires_in < CURRENT_TIMESTAMP
    // створити нову сесію в таблиці refreshsessions
    // expires_in = new Date(Date.now() + 8*3600000)
    // {user_id: uuid,  user_agent: ua, fingerprint, ip,  expires_in: new Date(Date.now() + 8*3600000)}

    const result = await db.insert('users', { email, password }, 'id')
    res.status(201).send(JSON.stringify({ uuid: result.rows[0].id, email }))
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
