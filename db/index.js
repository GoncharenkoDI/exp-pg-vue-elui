const config = require('config')
const { Pool } = require('pg')
const pool = new Pool(config.get('db'))
module.exports = {
  query: (text, params) => pool.query(text, params),
  insert: (table, params, returning = '') => {
    const fields = Object.keys(params)
    const queryParams = Object.keys(params).map(
      (value, index) => `$${index + 1}`
    )
    const values = Object.values(params)
    const retStr = returning ? ` RETURNING ${returning}` : ''
    const text = `INSERT INTO ${table}(${fields.join()}) VALUES(${queryParams.join()})${retStr}`

    return pool.query(text, values)
  }
}
