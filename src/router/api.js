import cors from 'cors'
import { Router } from 'express'
import { CONTEXTS } from '../shared/constants.js'
import { verify } from '../shared/jwt.js'

const api = Router()

api.use(cors())

function analyzeTokenFor(value) {
  return function (request, response, next) {
    const { headers: { authorization = '' } = {} } = request
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
  const { payload } = request

  console.log(payload)

  response.json({
    name: 'John Doe',
    email: 'john@example.com',
  })
})

export default api
