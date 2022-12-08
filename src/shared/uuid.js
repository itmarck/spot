import { randomUUID, createHash } from 'crypto'

export function generateClientId() {
  const uniqueId = randomUUID()
  const clientId = uniqueId.replace(/-/g, '')

  return clientId.substring(0, 16)
}

export function generateGravatarHash(email) {
  return createHash('md5').update(email).digest('hex')
}
