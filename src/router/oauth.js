import cors from 'cors'
import { Router } from 'express'
import { getSession } from '../data/session.js'
import { CONTEXTS, SESSIONS } from '../shared/constants.js'
import { sign } from '../shared/jwt.js'
import { isExpired } from '../shared/time.js'

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

function parseBody(body = {}) {
  return {
    type: body['type'],
    code: body['code'],
    clientId: body['client_id'],
    clientSecret: body['client_secret'],
  }
}

oauth.post('/token', async function ({ body }, response) {
  const { clientId, code } = parseBody(body)
  const session = await getSession({ type: SESSIONS.oauth, code })
  const userId = session && session.userId
  const createdAt = session && session.createdAt
  const payload = clientId && userId && { uid: userId, aid: 1 }
  const hasExpired = createdAt && isExpired(createdAt)
  const hasAccess = session && payload && !hasExpired
  const accessToken = hasAccess && sign(CONTEXTS.api, payload)

  // TODO: Validate client id and client secret.

  if (!hasAccess) {
    return response.status(401).send({
      message: 'Invalid or expired code.',
    })
  }

  response.json({
    token_type: 'Bearer',
    access_token: accessToken,
  })
})

export default oauth
