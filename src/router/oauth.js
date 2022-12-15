import cors from 'cors'
import { Router } from 'express'
import { URL } from 'url'
import { hasAccess } from '../data/access.js'
import { getApplication } from '../data/application.js'
import { createSession, getSession } from '../data/session.js'
import { parser } from '../middlewares/parser.js'
import { withUser } from '../middlewares/user.js'
import { CONTEXTS, SESSIONS } from '../shared/constants.js'
import { sign, verify } from '../shared/jwt.js'
import { isExpired } from '../shared/time.js'

const oauth = Router()

oauth.use(cors())
oauth.use(parser())

oauth.get('/authorize', withUser, async function (request, response) {
  const { query, originalUrl, userId } = request
  const loggedIn = response.locals.loggedIn
  const redirectUri = new URL(query['redirect_uri'])
  const clientId = query['client_id']
  const redirect = encodeURIComponent(redirectUri)
  const returnTo = encodeURIComponent(originalUrl)
  const application = await getApplication(clientId, { withOwner: true })
  const applicationId = application && application.id

  if (!applicationId) {
    return response.render('error', {
      message: `No existe una aplicación con el id "${clientId}"`,
    })
  }

  if (!loggedIn) {
    return response.redirect(`/login?return_to=${returnTo}`)
  }

  const granted = await hasAccess({ userId, applicationId })

  if (granted) {
    const code = await createSession({ type: SESSIONS.oauth, userId })
    return response.redirect(`${redirectUri}?code=${code}`)
  }

  response.header('Cache-Control', 'no-cache')

  response.render('authorize', {
    title: 'Autorizar aplicación',
    action: `/_/authorize?client_id=${clientId}&redirect_uri=${redirect}`,
    client: clientId,
    application: application,
    redirectDomain: redirectUri && redirectUri.origin,
  })
})

oauth.post('/token', async function (request, response) {
  const code = request.body['code']
  const clientId = request.body['client_id']
  const clientSecret = request.body['client_secret']
  const application = await getApplication(clientId)
  const applicationId = application && application.id

  if (!applicationId) {
    return response.status(404).send({
      message: 'There is no application with the given client id',
    })
  }

  if (!code) {
    return response.status(400).send({
      message: 'Missing code',
    })
  }

  const secretPayload = clientSecret && verify(clientSecret)
  const applicationClientId = application && application.clientId
  const secretClientId = secretPayload && secretPayload.cid

  if (applicationClientId !== secretClientId) {
    return response.status(401).send({
      message: 'Invalid client secret',
    })
  }

  const session = await getSession({ type: SESSIONS.oauth, code })
  const userId = session && session.userId
  const createdAt = session && session.createdAt
  const hasExpired = createdAt && isExpired(createdAt)

  if (!session || !userId || hasExpired) {
    return response.status(401).send({
      message: 'Invalid or expired code.',
    })
  }

  response.send({
    token_type: 'Bearer',
    access_token: sign(CONTEXTS.api, {
      uid: userId,
      aid: applicationId,
    }),
  })
})

export default oauth
