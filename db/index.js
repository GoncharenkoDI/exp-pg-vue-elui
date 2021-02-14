const config = require('config')
const { Pool } = require('pg')
const pool = new Pool(config.get('db'))
module.exports = {
  query: async (text, params) => {
    try {
      const result = await pool.query(text, params)
      return result
    } catch (error) {
      console.log('Query error: ', error)
      error.sender = 'server'
      error.source = 'db query error'
      throw error
    }
  },
  insert: async (table, fields, returning = '') => {
    try {
      const fieldsName = Object.keys(fields)
      const queryParams = Object.keys(fields).map(
        (value, index) => `$${index + 1}`
      )
      const values = Object.values(fields)
      const retStr = returning ? ` RETURNING ${returning}` : ''
      const text = `INSERT INTO ${table} (${fieldsName.join()}) VALUES (${queryParams.join()})${retStr}`
      return await pool.query(text, values)
    } catch (error) {
      console.log('insert error: ', error)
      error.sender = 'server'
      error.source = 'db insert error'
      throw error
    }
  },
  update: async (table, fields, where, params) => {
    try {
      const fieldsSet = Object.keys(fields)
        .map((field, index) => `${field} = $${index + 1}`)
        .join()
      const text = `UPDATE ${table} SET ${fieldsSet} WHERE ${where}`

      return await pool.query(text, [...Object.values(fields), ...params])
    } catch (error) {
      console.log('update error: ', error)
      error.sender = 'server'
      error.source = 'db insert error'
      throw error
    }
  }
}
