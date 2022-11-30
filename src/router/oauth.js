import cors from 'cors'
import { Router } from 'express'

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
  const { grant_type, code, client_id } = body

  response.json({
    token_type: 'Bearer',
    access_token: 'KDx2HG5K71',
  })
})

export default oauth
