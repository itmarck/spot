import { User } from '../core/user.js'
import { host } from '../shared/configuration.js'
import { execute } from '../shared/database.js'
import { getGravatar } from './avatar.js'

export async function getUser(value, { byEmail = false } = {}) {
  const hostname = host()
  const criteria = byEmail ? 'email' : 'id'
  const query = `SELECT * FROM user WHERE ${criteria} = "${value}"`
  const data = await execute(query, { as: 'object' })
  const email = data && data.email
  const avatar = email && `${hostname}/avatars/${email.length % 9}`

  if (!email) {
    return
  }

  const gravatar = await getGravatar(email)
  data.avatar = gravatar || avatar

  return data && User.fromJSON(data)
}
