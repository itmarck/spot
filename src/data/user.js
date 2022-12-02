import { User } from '../core/user.js'
import { execute } from '../shared/database.js'

export async function getUser(id) {
  const query = `SELECT * FROM user WHERE id = "${id}"`
  const data = await execute(query, { as: 'object' })

  return data && User.fromJSON(data)
}
