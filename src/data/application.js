import { Application } from '../core/application.js'
import { execute } from '../shared/database.js'
import { generateClientId } from '../shared/uuid.js'

export async function getApplication(clientId) {
  const query = `
    SELECT * FROM application
    WHERE client_id = '${clientId}'
  `
  const data = await execute(query, { as: 'object' })

  return data && Application.fromJSON(data)
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
