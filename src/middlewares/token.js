import { getUser } from '../data/user.js'
import { CONTEXTS, KEYS } from '../shared/constants.js'
import { verify } from '../shared/jwt.js'

export function analyzeContext(value) {
  return function (request, response, next) {
    const authorization = request.get('authorization') || ''
    const formatted = authorization.startsWith('Bearer ')
    const token = formatted && authorization.substring(7)
    const payload = token && verify(token)
    const context = payload && payload.context

    if (context !== value) {
      return response.status(403).send()
    }

    if (payload) {
      request.payload = payload
    }

    next()
  }
}

export function analizeInternalToken() {
  return async function (request, response, next) {
    const token = request.cookies[KEYS.internalToken]
    const payload = verify(token)
    const userId = payload && payload.uid
    const context = payload && payload.context
    const loggedIn = userId && context === CONTEXTS.internal

    response.locals.loggedIn = loggedIn

    if (loggedIn) {
      response.locals.user = await getUser(userId)
    }

    next()
  }
}
