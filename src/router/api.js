import cors from 'cors'
import { Router } from 'express'
import { getUser } from '../data/user.js'
import { CONTEXTS } from '../shared/constants.js'
import { verify } from '../shared/jwt.js'

const api = Router()

api.use(cors())

function analyzeTokenFor(value) {
  return function (request, response, next) {
    const authorization = request.get('authorization') || ''
    const formatted = authorization.startsWith('Bearer ')
    const token = formatted && authorization.substring(7)
    const payload = token && verify(token)
    const context = payload && payload.context

    if (context !== value) {
      response.status(401).send()
      return
    }

    if (payload) {
      request.payload = payload
    }

    next()
  }
}

api.use(analyzeTokenFor(CONTEXTS.api))

api.get('/user', async function (request, response) {
  const { payload: { uid } = {} } = request
  const user = await getUser(uid)

  if (!user) {
    response.status(404).send()
    return
  }

  response.json(user)
})

export default api
