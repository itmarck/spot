import { Session } from '../core/session.js'
import { SESSIONS } from '../shared/constants.js'
import { execute } from '../shared/database.js'
import { generateCode } from '../shared/uuid.js'

/**
 * Get session from database by code and session type.
 *
 * @param {object} options
 * @param {number} options.type Session type.
 * @param {number} options.userId Session user identifier.
 * @param {string} options.code Session code.
 * @returns
 */
export async function getSession({ type = SESSIONS.web, code, userId }) {
  if (!Object.values(SESSIONS).includes(type)) {
    throw new Error(`Invalid session type: ${type}`)
  }

  const query = `
    SELECT * FROM session
    WHERE type = '${type}'
    AND code = '${code}'
    OR user = '${userId}'
    ORDER BY id DESC
    LIMIT 1
  `
  const data = await execute(query, { as: 'object' })

  return data && Session.fromJSON(data)
}

export async function createSession({ type = SESSIONS.web, userId }) {
  const code = generateCode(type)
  const query = `
    INSERT INTO session (user, type, code)
    VALUES ('${userId}', '${type}', '${code}')
  `
  await execute(query)

  return code
}
