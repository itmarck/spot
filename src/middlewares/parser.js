import { CONTEXTS, KEYS } from '../shared/constants.js'
import { verify } from '../shared/jwt.js'

export function parser({ from = CONTEXTS.internal } = {}) {
  return function (request, response, next) {
    const cookies = request.cookies || {}
    const authorization = request.get('authorization') || ''
    const formatted = authorization.startsWith('Bearer ')
    const tokens = {
      [CONTEXTS.api]: formatted && authorization.substring(7),
      [CONTEXTS.internal]: cookies[KEYS.internalToken],
    }
    const token = tokens[from]
    const payload = token && verify(token)
    const userId = payload && payload.uid
    const context = payload && payload.context
    const loggedIn = userId && context === CONTEXTS.internal

    if (payload) {
      request.payload = payload
      request.userId = userId

      response.locals.loggedIn = loggedIn
    }

    next()
  }
}
