const db = require('../db')
const config = require('config')

const Session = {
  /** створення нової сесії
   * @param { userId, ip, ua, fingerprint } session
   * @returns { refreshToken, expiresIn }
   */
  async newSession({ userId, ip, ua, fingerprint }) {
    //
    let result
    let message
    let registerError
    const client = await db.getClient()
    try {
      // виконати в межах однієї транзакції
      await db.startTransaction(client)
      // видалити протерміновані сесії
      await db.clientQuery(
        client,
        'DELETE FROM public.refreshsessions WHERE expires_in < CURRENT_TIMESTAMP'
      )
      // видалити сесію користувача за userId, ip, ua, fingerprint
      await db.clientDelete(
        client,
        'public.refreshsessions',
        'user_id = $1 AND ip = $2 AND user_agent = $3 AND fingerprint = $4',
        [userId, ip, ua, fingerprint]
      )
      const sessionOptions = config.get('session')
      const maxSessions = +sessionOptions.maxSessions || 5
      // отримати id сесій користувача
      result = await db.clientQuery(
        client,
        'SELECT id FROM public.refreshsessions WHERE user_id = $1 ORDER BY expires_in ASC',
        [userId]
      )
      // залишити у користувача тільки 4 сесії
      const sessions = result.rows.slice(maxSessions - 1)
      if (sessions.length) {
        await db.clientQuery(
          client,
          `DELETE FROM public.refreshsessions WHERE id IN ( ${sessions.join()} ) `
        )
      }
      // створити нову сесію
      const duration = +sessionOptions.duration || 8
      result = await db.clientInsert(
        client,
        'refreshsessions',
        {
          user_id: userId,
          user_agent: ua,
          fingerprint: fingerprint,
          ip: ip,
          expires_in: new Date(Date.now() + duration * 3600000)
        },
        'refresh_token, expires_in'
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось створити сесію користувача.'
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'Session updateSession error'
        throw registerError
      }

      const refreshToken = result.rows[0].refresh_token
      const expiresIn = result.rows[0].expires_in
      await db.commitTransaction(client)
      return { refreshToken, expiresIn }
    } catch (error) {
      if (!error.sender) {
        console.log('Session newSession error: ', error)
      }
      error.sender = error.sender || 'server'
      error.source = error.source || 'Session newSession error'
      await db.rollbackTransaction(client)
      throw error
    } finally {
      client.release()
    }
  },
  /**
   *
   * @param { userId, ip, ua, fingerprint } session
   */
  async updateSession(sessionId) {
    //
    let result
    let message
    let registerError
    try {
      const sessionOptions = config.get('session')
      const duration = +sessionOptions.duration || 8
      result = await db.query(
        `UPDATE 
           public.refreshsessions 
         SET 
           refresh_token = en_random_uuid(),
           expires_in = $1,
           update_at = null 
         WHERE id = $2 
         RETURNING refresh_token, expires_in`,
        [new Date(Date.now() + duration * 3600000), sessionId]
      )
      if (result.rows.length === 0) {
        message = 'Не вдалось створити сесію користувача.'
        registerError = new Error(message)
        registerError.sender = 'server'
        registerError.source = 'Session updateSession error'
        throw registerError
      }

      const refreshToken = result.rows[0].refresh_token
      const expiresIn = result.rows[0].expires_in
      return { refreshToken, expiresIn }
    } catch (error) {
      if (!error.sender) {
        console.log('Session newSession error: ', error)
      }
      error.sender = error.sender || 'server'
      error.source = error.source || 'Session newSession error'
      throw error
    }
  },
  /** отримання токена за { token, ip, ua, fingerprint }
   * @returns {id, user_id, refresh_token, user_agent, fingerprint, ip, expires_in, create_at, update_at}
   */
  async getSession({ token, ip, ua, fingerprint }) {
    try {
      const result = await db.query(
        `SELECT * 
        FROM public.refreshsessions 
        WHERE refresh_token = $1 
          AND ip = $2 
          AND user_agent = $3 
          AND fingerprint = $4`,
        [token, ip, ua, fingerprint]
      )
      if (result.rows.length === 0) {
        return {}
      } else {
        return result.rows[0]
      }
    } catch (error) {
      if (!error.sender) {
        console.log('Session getSession error: ', error)
      }
      error.sender = error.sender || 'server'
      error.source = error.source || 'Session getSession error'
      throw error
    }
  },

  /** видалення застарілих сесій */
  async deleteOldSessions() {
    try {
      await db.Query(
        'DELETE FROM public.refreshsessions WHERE expires_in < CURRENT_TIMESTAMP'
      )
    } catch (error) {
      if (!error.sender) {
        console.log('Session deleteOldSessions error: ', error)
      }
      error.sender = error.sender || 'server'
      error.source = error.source || 'Session deleteOldSessions error'
      throw error
    }
  }
}
module.exports = Session
