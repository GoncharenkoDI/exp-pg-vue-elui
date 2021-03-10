const db = require('../db')
const config = require('config')
const bcrypt = require('bcrypt')

const User = {
  async getUsers() {},
  /**
   *
   * @param { uuid } userId
   * @returns { userId, email, user_name, last_login, login_state, session_id, token, create_at, update_at }
   *
   *
   */
  async getUser(userId) {
    try {
      const {
        rows
      } = await db.query(
        'SELECT id as userId, email, user_name, last_login, login_state, session_id, token, create_at, update_at FROM users WHERE id = $1',
        [userId]
      )
      if (rows.length === 0) {
        return {}
      } else {
        return rows[0]
      }
    } catch (error) {
      console.log(error)
      error.sender = error.sender || 'api server'
      error.source = error.source || 'User getUser error'
      throw error
    }
  },
  /**
   *
   * @param {string} email
   */
  async getUserByEmail(email) {},

  /** реєстрація нового користувача
   * @method addUser
   * @param candidate {email, password, name}
   * @param sessionOptions = {ip,ua, fingerprint, }
   * @returns {userId, refreshToken, expiresIn}
   * @throws {message:'Невідома причина', sender:'server', source:'model User addUser'}
   */
  async addUser({ email, password, name }, { ip, ua, fingerprint }) {
    // необхідно додати перевірки унікальності email
    // створити access-token
    // записати в межах одної транзакції
    let result
    let message
    let registerError
    const client = await db.getClient()
    try {
      await db.startTransaction(client)
      const saltRounds = +config.get('bcrypt').saltRounds
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      // створити запис в таблиці users { email, password} отримати uuid як userId
      result = await db.clientInsert(
        client,
        'users',
        { email, password: hashedPassword, user_name: name },
        'id'
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось створити користувача.'
        console.log('register error: ', message)
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'POST /api/user/register error'
        throw registerError
      }
      const userId = result.rows[0].id
      // створити запис в таблиці auth_assignment {user_id, item_name: 'public' }
      result = await db.clientInsert(
        client,
        'auth_assignment',
        { user_id: userId, item_name: 'user' },
        'item_name'
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось надати користувачеві початкові повноваження.'
        console.log('register error: ', message)
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'POST /api/user/register error'
        throw registerError
      }
      // видалити протерміновані сесії delete from public.refreshsessions where expires_in < CURRENT_TIMESTAMP
      await db.clientQuery(
        client,
        'DELETE FROM public.refreshsessions WHERE expires_in < CURRENT_TIMESTAMP'
      )
      // створити нову сесію в таблиці refreshsessions expires_in - 8 годин
      // {user_id,  user_agent: ua, fingerprint, ip,  expires_in: new Date(Date.now() + 8*3600000)} отримати refresh_token
      result = await db.clientInsert(
        client,
        'refreshsessions',
        {
          user_id: userId,
          user_agent: ua,
          fingerprint,
          ip,
          expires_in: new Date(Date.now() + 8 * 3600000)
        },
        'refresh_token, expires_in'
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось створити користувача.'
        console.log('register error: ', message)
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'POST /api/user/register error'
        throw registerError
      }
      const refreshToken = result.rows[0].refresh_token
      const expiresIn = result.rows[0].expires_in
      await db.commitTransaction(client)
      return { userId, refreshToken, expiresIn }
    } catch (error) {
      console.log(error)
      error.sender = error.sender || 'server'
      error.source = error.source || 'User addUser error'
      await db.rollbackTransaction(client)
      throw error
    } finally {
      client.release()
    }
  },
  async updateUser(userId) {},
  async deleteUser(userId) {}
}
module.exports = User
