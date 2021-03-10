const express = require('express')
const config = require('config')
const mountRoutes = require('./routers')
const authenticationMiddleware = require('./middleware/authentication.middleware')

const app = express()

app.use(express.json())
app.use(authenticationMiddleware)
mountRoutes(app)

app.use(function (req, res) {
  res.status(404).send(JSON.stringify({ message: 'Не знайдено' }))
})
const PORT = config.get('port') || 5000
app.listen(PORT, () => console.log(`App has been started at port ${PORT} ...`))
