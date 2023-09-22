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
  repository

  /**
   * @param {UserRepository} userRepository User repository
   */
  constructor(userRepository) {
    this.repository = userRepository
  }

  /**
   * @param {object} options
   * @param {string} options.userId User identifier
   * @returns {Promise<User>}
   */
  async getUser({ userId }) {
    return await this.repository.findUser({
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
    return await this.repository.findRecord({
      name: name,
      userId: userId,
      applicationId: applicationId,
    })
  }
}
