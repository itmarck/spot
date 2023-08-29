// @ts-check

import { Record } from '../../core/common/Record.js'
import { User } from '../../core/users/User.js'
import { UserRepository } from '../../core/users/UserRepository.js'

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
    return new User({
      id: userId,
      email: 'email',
      name: 'name',
      avatar: 'avatar',
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
