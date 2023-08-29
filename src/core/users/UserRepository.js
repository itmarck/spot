// @ts-check

import { Record } from '../common/Record.js'
import { User } from '../users/User.js'

/**
 * @abstract
 */
export class UserRepository {
  /**
   * Create an instance for user repository.
   */
  constructor() {
    if (this.constructor == UserRepository) {
      throw new Error('Cannot instantiate abstract class')
    }
  }

  /**
   * @abstract
   * @param {object} options
   * @param {string} options.userId
   * @returns {Promise<User>}
   */
  async findUser(options) {
    throw new Error('Not implemented')
  }

  /**
   * @abstract
   * @param {object} options
   * @param {string} options.name
   * @param {string} options.userId
   * @param {string} options.applicationId
   * @returns {Promise<Record>}
   */
  async findRecord(options) {
    throw new Error('Not implemented')
  }
}
