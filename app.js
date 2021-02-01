const express = require('express')
const config = require('config')
const mountRoutes = require('./routes')

const app = express()
mountRoutes(app)

const PORT = config.get('port') || 5000
app.listen(PORT, () => console.log(`App has been started at port ${PORT} ...`))
