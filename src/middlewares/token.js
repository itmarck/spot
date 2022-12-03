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
