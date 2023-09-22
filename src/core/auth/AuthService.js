// @ts-check

export class AuthService {
  /**
   * @private
   */
  repository

  /**
   *
   * @param {string} authRepository
   */
  constructor(authRepository) {
    this.repository = authRepository
  }

  /**
   * @param {object} options
   * @param {string} options.userId
   */
  async hasAccess({ userId }) {
    return await this.repository
  }
}
