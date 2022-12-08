import { Session } from '../core/session.js'
import { SESSIONS } from '../shared/constants.js'
import { execute } from '../shared/database.js'

/**
 * Get session from database by code and session type.
 *
 * @param {object} options
 * @param {number} options.type Session type.
 * @param {number} options.user Session user identifier.
 * @param {string} options.code Session code.
 * @returns
 */
export async function getSession({ type = SESSIONS.web, code, user }) {
  if (!Object.values(SESSIONS).includes(type)) {
    throw new Error(`Invalid session type: ${type}`)
  }

  const query = `
    SELECT * FROM session
    WHERE type = "${type}"
    AND code = "${code}"
    OR user = "${user}"
    ORDER BY id DESC
    LIMIT 1
  `
  const data = await execute(query, { as: 'object' })

  return data && Session.fromJSON(data)
}
