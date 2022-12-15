import { execute } from '../shared/database.js'

export async function hasAccess({ userId, applicationId }) {
  if (!userId || !applicationId) {
    return false
  }

  const query = `
    SELECT * FROM access
    WHERE user = '${userId}'
    AND application = '${applicationId}'
  `
  const data = await execute(query, { as: 'object' })

  return !!data
}

export async function setAccess({ userId, applicationId }) {
  const query = `
    INSERT INTO access (user, application)
    VALUES ('${userId}', '${applicationId}')
  `
  await execute(query)
}

export async function revokeAccess({ userId, applicationId }) {
  const query = `
    DELETE FROM access
    WHERE user = '${userId}' AND application = '${applicationId}'
  `
  await execute(query)
}
