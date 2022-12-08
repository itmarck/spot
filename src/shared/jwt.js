import jsonwebtoken from 'jsonwebtoken'
import { jwt } from './configuration.js'
import { CONTEXTS } from './constants.js'

/**
 * Sign a JWT token.
 * @param {string} context Endpoints allowed to use the token.
 * @param {object} payload Payload to be signed.
 * @returns {string} Signed token.
 */
export function sign(context, payload) {
  if (!Object.values(CONTEXTS).includes(context)) {
    throw new Error(`Invalid context: ${context}`)
  }
  return jsonwebtoken.sign({ context, ...payload }, jwt.secret)
}

/**
 * Verify a JWT token.
 * @param {string} token Token to be verified.
 * @returns {object} Payload previously signed.
 */
export function verify(token) {
  try {
    return jsonwebtoken.verify(token, jwt.secret)
  } catch (error) {
    return
  }
}
