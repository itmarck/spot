// @ts-check

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('../../core/users/UserService').UserService} UserService
 */

import { Controller } from './Controller.js'

export class UserController extends Controller {
  /**
   * @private
   * @type {UserService}
   */
  userService

  /**
   * @param {UserService} userService
   */
  constructor(userService) {
    super()
    this.userService = userService
  }

  /**
   * @typedef {object} Payload
   * @property {string} userId
   */

  /**
   * @param {Request & Payload} request
   * @param {Response} response
   */
  async getUser(request, response) {
    const user = await this.userService.getUser({
      userId: request.userId,
    })
    response.send(user)
  }

  /**
   * @returns {Promise<void>}
   */
  async getUserRecords(request, response) {
    const record = await this.userService.getUserRecord({
      name: request.params.name,
      userId: request.payload.uid,
      applicationId: request.payload.aid,
    })
    response.send(record)
  }
}
