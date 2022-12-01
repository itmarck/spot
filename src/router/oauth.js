import cors from 'cors'
import { Router } from 'express'
import { CONTEXTS } from '../shared/constants.js'
import { sign } from '../shared/jwt.js'

const oauth = Router()

oauth.use(cors())

oauth.get('/authorize', function ({ query, cookies }, response) {
  response.render('authorize', {
    client: query['client_id'],
    secret: query['client_secret'],
    redirect: query['redirect_uri'],
    scope: query['scope'],
    state: query['state'],
    token: cookies['access_token'],
    responseType: query['response_type'],
  })
})

oauth.post('/token', function (request, response) {
  const { body } = request
  const { client_id } = body

  response.json({
    token_type: 'Bearer',
    access_token: sign(CONTEXTS.api, { client_id }),
  })
})

export default oauth
