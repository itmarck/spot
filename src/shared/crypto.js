import { createHash, randomUUID } from 'crypto'
import { SESSIONS } from './constants.js'

export function generateClientId() {
  const uniqueId = randomUUID()
  const clientId = uniqueId.replace(/-/g, '')

  return clientId.substring(0, 16)
}

export function generateGravatarHash(email) {
  return createHash('md5').update(email).digest('hex')
}

export function generateCode(sessionType = SESSIONS.web) {
  switch (sessionType) {
    case SESSIONS.web:
      return Math.floor(100000 + Math.random() * 900000)
    case SESSIONS.oauth:
      return randomUUID().replace(/-/g, '')
    default:
      return randomUUID()
  }
}
