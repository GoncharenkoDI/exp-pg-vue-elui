const db = require('../db')
const config = require('config')

const Session = {
  /**
   *
   * @param { userId, ip, ua, fingerprint } session
   */
  async newSession(session) {
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
          user_id: session.userId,
          user_agent: session.ua,
          fingerprint: session.fingerprint,
          ip: session.ip,
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
  }
}
module.exports = Session
