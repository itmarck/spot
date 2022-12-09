import { Application } from '../core/application.js'
import { CONTEXTS } from '../shared/constants.js'
import { execute } from '../shared/database.js'
import { sign } from '../shared/jwt.js'
import { generateClientId } from '../shared/uuid.js'
import { getUser } from './user.js'

export async function getApplication(clientId, { withOwner } = {}) {
  const query = `
    SELECT * FROM application
    WHERE client_id = '${clientId}'
  `
  const data = await execute(query, { as: 'object' })
  const ownerId = data && data.owner

  if (withOwner && ownerId) {
    data.owner = await getUser(ownerId)
  }

  return data && Application.fromJSON(data)
}

export async function getApplicationSecret(clientId) {
  return sign(CONTEXTS.secret, { cid: clientId })
}

export async function createApplication(userId, { name, redirectUri }) {
  const avatar = '/avatars/1'
  const slug = name && name.toLowerCase().replace(/[^a-z]/g, '')
  const clientId = generateClientId()
  const query = `
    INSERT INTO application (owner, slug, name, redirect_uri, client_id, avatar)
    VALUES ('${userId}', '${slug}', '${name}', '${redirectUri}', '${clientId}', '${avatar}')
  `
  await execute(query)

  return await getApplication(clientId, userId)
}
