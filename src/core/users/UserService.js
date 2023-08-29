// @ts-check

import { Record } from '../common/Record.js'
import { User } from './User.js'

/**
 * @typedef {import('./UserRepository.js').UserRepository} UserRepository
 */

export class UserService {
  /**
   * @private
   * @type {UserRepository}
   */
  userRepository

  /**
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository
  }
  /**
   * @param {object} options
   * @param {string} options.userId
   * @returns {Promise<User>}
   */
  async getUser({ userId }) {
    return await this.userRepository.findUser({
      userId: userId,
    })
  }

  /**
   * @param {object} options
   * @param {string} options.name
   * @param {string} options.userId
   * @param {string} options.applicationId
   * @returns {Promise<Record>}
   */
  async getUserRecord({ name, userId, applicationId }) {
    return await this.userRepository.findRecord({
      name: name,
      userId: userId,
      applicationId: applicationId,
    })
  }
}