import { Application } from '../core/application.js'
import { CONTEXTS } from '../shared/constants.js'
import { execute } from '../shared/database.js'
import { sign } from '../shared/jwt.js'
import { generateClientId } from '../shared/crypto.js'
import { getUser } from './user.js'

async function markAsSeen(clientId) {
  const query = `
    UPDATE application
    SET seen = 1
    WHERE client_id = '${clientId}'
  `
  await execute(query)
}

export async function getApplication(
  value,
  { withOwner, withSecret, bySlug } = {},
) {
  const criteria = bySlug ? 'slug' : 'client_id'
  const query = `
    SELECT * FROM application
    WHERE ${criteria} = '${value}'
  `
  const data = await execute(query, { as: 'object' })
  const notSeen = data && data.seen === 0
  const ownerId = data && data.owner
  const clientId = data && data.client_id

  if (withSecret) {
    if (notSeen) {
      data['client_secret'] = await getApplicationSecret(clientId)
      await markAsSeen(clientId)
    }
  }

  if (withOwner && ownerId) {
    const owner = await getUser(ownerId)
    data['owner_name'] = owner.name
    data['owner_email'] = owner.email
    data['owner_avatar'] = owner.avatar
  }

  return data && Application.fromJSON(data)
}

export async function getApplicationSecret(clientId) {
  return sign(CONTEXTS.secret, { cid: clientId })
}

/**
 * Create a new application for the given user
 * @param {object} options Application properties
 * @returns {Promise<string>} The application slug
 */
export async function createApplication({
  userId,
  name,
  redirectUri,
  description = '',
}) {
  const slug = name && name.toLowerCase().replace(/[^a-z]/g, '')
  const avatar = `/avatars/${slug.length % 9}`
  const clientId = generateClientId()
  const query = `
    INSERT INTO application (owner, slug, name, description, redirect_uri, client_id, avatar)
    VALUES ('${userId}', '${slug}', '${name}', '${description}', '${redirectUri}', '${clientId}', '${avatar}')
  `
  await execute(query)

  return slug
}

export async function updateApplication(
  applicationId,
  { name, description, redirectUri },
) {
  const updatedSlug = name && name.toLowerCase().replace(/[^a-z]/g, '')
  const query = `
    UPDATE application
    SET slug = '${updatedSlug}',
        name = '${name}',
        description = '${description}',
        redirect_uri = '${redirectUri}'
    WHERE id = '${applicationId}'
  `
  await execute(query)
}

export async function forgetApplication(applicationId) {
  const query = `
    UPDATE application
    SET seen = 0
    WHERE id = '${applicationId}'
  `
  await execute(query)
}

export async function getAuthorizedApplications(userId) {
  const query = `
    SELECT
      application.*,
      user.name AS owner_name,
      user.email AS owner_email,
      user.avatar AS owner_avatar,
      access.created_at AS authorized_at
    FROM application
    INNER JOIN access ON application.id = access.application
    INNER JOIN user ON user.id = application.owner
    WHERE access.user = '${userId}'
  `
  const data = await execute(query, { as: 'array' })

  return data && data.map((item) => Application.fromJSON(item))
}

export async function getCreatedApplications(userId) {
  const query = `
    SELECT * FROM application
    WHERE owner = '${userId}'
  `
  const data = await execute(query, { as: 'array' })

  return data && data.map((item) => Application.fromJSON(item))
}
