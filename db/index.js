const config = require('config')
const { Pool } = require('pg')
const pool = new Pool(config.get('db'))
module.exports = {
  query: async (text, params) => {
    try {
      const result = await pool.query(text, params)
      return result
    } catch (error) {
      console.log('Query error: ', error.message)
      throw error
    }
  },
  insert: async (table, params, returning = '') => {
    try {
      const fields = Object.keys(params)
      const queryParams = Object.keys(params).map(
        (value, index) => `$${index + 1}`
      )
      const values = Object.values(params)
      const retStr = returning ? ` RETURNING ${returning}` : ''
      const text = `INSERT INTO ${table} (${fields.join()}) VALUES (${queryParams.join()})${retStr}`
      console.log('text: ', text)
      console.log('values: ', values)
      return await pool.query(text, values)
    } catch (error) {
      console.log('Query error: ', error)
      throw error
    }
  }
}
