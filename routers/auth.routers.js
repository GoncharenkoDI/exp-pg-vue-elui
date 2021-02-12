const { json } = require('express')
const express = require('express')
const db = require('../db')

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    //отримати з req.body {email, password, }
    const { email, password } = req.body
    res.send(JSON.stringify({ email, password }))
  } catch (error) {
    console.log(error)
    res.status(500).send(JSON.stringify({ message: error.message }))
  }
})

module.exports = router
