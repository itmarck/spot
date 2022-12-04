import cors from 'cors'
import { Router } from 'express'
import { getApplication } from '../data/application.js'
import { getSession } from '../data/session.js'
import { CONTEXTS, SESSIONS } from '../shared/constants.js'
import { sign, verify } from '../shared/jwt.js'
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
    code: body['code'],
    clientId: body['client_id'],
    clientSecret: body['client_secret'],
  }
}

oauth.post('/token', async function ({ body }, response) {
  const { clientId, clientSecret, code } = parseBody(body)
  const application = await getApplication(clientId)

  if (!application) {
    return response.status(404).send({
      message: 'There is no application with the given client id',
    })
  }

  const applicationId = application && application.id
  const applicationClient = application && application.clientId
  const secretPayload = clientSecret && verify(clientSecret)
  const secretClient = secretPayload && secretPayload.cid

  if (applicationClient !== secretClient) {
    return response.status(401).send({
      message: 'Invalid client secret',
    })
  }

  if (!code) {
    return response.status(400).send({
      message: 'Missing code',
    })
  }

  const session = await getSession({ type: SESSIONS.oauth, code })
  const userId = session && session.userId
  const createdAt = session && session.createdAt
  const payload = clientId && userId && { uid: userId, aid: applicationId }
  const hasExpired = createdAt && isExpired(createdAt)
  const hasAccess = session && payload && !hasExpired
  const accessToken = hasAccess && sign(CONTEXTS.api, payload)

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
