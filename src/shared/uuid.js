import { randomUUID } from 'crypto'

export function generateClientId() {
  const uniqueId = randomUUID()
  const clientId = uniqueId.replace(/-/g, '')

  return clientId.substring(0, 16)
}
