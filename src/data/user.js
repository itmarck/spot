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
  const avatar = data && data.avatar

  if (!email) {
    return
  }

  if (avatar && avatar.startsWith('/')) {
    data.avatar = `${hostname}${avatar}`
  }

  return data && User.fromJSON(data)
}

export async function createUser(email, { name, avatar }) {
  const query = `
    INSERT INTO user (email, name, avatar)
    VALUES ('${email}', '${name}', '${avatar}')
  `
  await execute(query)
  return getUser(email, { byEmail: true })
}

export async function updateUser(userId, { name }) {
  const query = `
    UPDATE user
    SET name = '${name}'
    WHERE id = '${userId}'
  `
  await execute(query)
}

export async function getOrCreateUser(email = '') {
  const user = await getUser(email, { byEmail: true })

  if (user) {
    return user
  }

  const defaultName = email.split('@')[0]
  const defaultAvatar = `/avatars/${email.length % 9}`
  const gravatar = await getGravatar(email)
  const { name, photo } = gravatar || {}

  return await createUser(email, {
    name: name || defaultName,
    avatar: photo || defaultAvatar,
  })
}
