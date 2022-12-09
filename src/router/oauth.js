import cors from 'cors'
import { Router } from 'express'
import { URL } from 'url'
import { hasAccess } from '../data/access.js'
import { getApplication } from '../data/application.js'
import { createSession, getSession } from '../data/session.js'
import { CONTEXTS, KEYS, SESSIONS } from '../shared/constants.js'
import { sign, verify } from '../shared/jwt.js'
import { isExpired } from '../shared/time.js'

const oauth = Router()

oauth.use(cors())

oauth.get('/authorize', async function (request, response) {
  const { query, cookies, originalUrl } = request
  const clientId = query['client_id']
  const redirectUri = new URL(query['redirect_uri'])
  const redirect = encodeURIComponent(redirectUri)
  const returnTo = encodeURIComponent(originalUrl)
  const internalToken = cookies[KEYS.internalToken]
  const { uid, context } = verify(internalToken) || {}
  const application = await getApplication(clientId, { withOwner: true })
  const applicationId = application && application.id
  const loggedIn = uid && context === CONTEXTS.internal

  if (!applicationId) {
    return response.render('error', {
      message: `No existe una aplicación con el id "${clientId}"`,
    })
  }

  if (!loggedIn) {
    return response.redirect(`/login?return_to=${returnTo}`)
  }

  const granted = await hasAccess({ userId: uid, applicationId })

  if (granted) {
    const code = await createSession({ type: SESSIONS.oauth, userId: uid })
    return response.redirect(`${redirectUri}?code=${code}`)
  }

  response.header('Cache-Control', 'no-cache')

  response.render('authorize', {
    title: 'Autorizar aplicación',
    action: `/_/access?client_id=${clientId}&redirect_uri=${redirect}`,
    client: clientId,
    application: application,
    redirectDomain: redirectUri && redirectUri.origin,
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
  const secretPayload = clientSecret && verify(clientSecret)
  const applicationClientId = application && application.clientId
  const secretClientId = secretPayload && secretPayload.cid

  if (applicationClientId !== secretClientId) {
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

  if (!session || !payload || hasExpired) {
    return response.status(401).send({
      message: 'Invalid or expired code.',
    })
  }

  response.json({
    token_type: 'Bearer',
    access_token: sign(CONTEXTS.api, payload),
  })
})

export default oauth
