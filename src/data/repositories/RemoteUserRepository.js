// @ts-check

import { Record, User, UserRepository } from '#core/index.js'
import { knex } from '#shared/vendors/knex.js'

export class RemoteUserRepository extends UserRepository {
  constructor() {
    super()
  }

  /**
   * @param {object} options
   * @param {string} options.userId
   * @returns {Promise<User>}
   */
  async findUser({ userId }) {
    const query = knex('user').where('id', userId).first()
    const user = await query.then()

    if (!user) {
      throw new Error(`User not found ${userId}`)
    }

    return new User({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    })
  }

  /**
   * @param {object} options
   * @returns {Promise<Record>}
   */
  async findRecord(options) {
    return new Record({
      id: 'id',
      type: 'object',
      name: 'name',
      value: {
        theme: 'dark',
      },
    })
  }
}
