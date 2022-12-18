import cors from 'cors'
import { Router } from 'express'
import { hasAccess, setAccess } from '../data/access.js'
import { getApplication } from '../data/application.js'
import { createSession, getSession } from '../data/session.js'
import { parser } from '../middlewares/parser.js'
import { withUser } from '../middlewares/user.js'
import { CONTEXTS, SESSIONS } from '../shared/constants.js'
import { sign, verify } from '../shared/jwt.js'
import { isExpired } from '../shared/time.js'
import { parseUrl } from '../shared/url.js'

const oauth = Router()

oauth.use(cors())
oauth.use(parser())

oauth.get('/authorize', withUser, async function (request, response) {
  const userId = request.userId
  const loggedIn = response.locals.loggedIn
  const clientId = request.query['client_id']
  const redirectUri = request.query['redirect_uri']
  const codeChallenge = request.query['code_challenge']
  const application = await getApplication(clientId, { withOwner: true })
  const applicationId = application && application.id

  if (!applicationId) {
    return response.render('error', {
      message: `No existe una aplicación con el id "${clientId}"`,
    })
  }

  if (!loggedIn) {
    return response.redirect(`/login?return_to=${request.originalUrl}`)
  }

  const verifier = codeChallenge
  const redirectUrl = parseUrl(redirectUri, application.redirectUri)
  const granted = await hasAccess({ userId, applicationId })

  if (granted) {
    const code = await createSession({ type: SESSIONS.oauth, userId, verifier })

    redirectUrl.searchParams.set('code', code)

    return response.redirect(redirectUrl.href)
  }

  response.header('Cache-Control', 'no-cache')

  response.render('authorize', {
    title: 'Autorizar aplicación',
    application: application,
    redirectDomain: redirectUrl.origin,
  })
})

oauth.post('/authorize', async function (request, response) {
  const userId = request.userId
  const clientId = request.query['client_id']
  const redirectUri = request.query['redirect_uri']
  const codeChallenge = request.query['code_challenge']
  const application = await getApplication(clientId)
  const applicationId = application && application.id

  if (!applicationId) {
    return response.render('error', {
      message: 'No existe una aplicación con el id "${clientId}"',
    })
  }

  if (!userId) {
    return response.render('error', {
      message: 'Usuario no encontrado',
    })
  }

  const verifier = codeChallenge
  const redirectUrl = parseUrl(redirectUri, application.redirectUri)
  const granted = await hasAccess({ userId, applicationId })
  const code = await createSession({ type: SESSIONS.oauth, userId, verifier })

  if (!granted) {
    await setAccess({ userId, applicationId })
  }

  redirectUrl.searchParams.set('code', code)

  return response.redirect(redirectUrl.href)
})

oauth.post('/token', async function (request, response) {
  const code = request.body['code']
  const clientId = request.body['client_id']
  const clientSecret = request.body['client_secret']
  const codeVerifier = request.body['code_verifier']
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
  const secretClientId = secretPayload && secretPayload.cid
  const applicationClientId = application && application.clientId

  if (clientSecret && secretClientId !== applicationClientId) {
    return response.status(401).send({
      message: 'Invalid client secret',
    })
  }

  const session = await getSession({ type: SESSIONS.oauth, code })
  const userId = session && session.userId
  const verifier = session && session.verifier
  const createdAt = session && session.createdAt
  const hasExpired = createdAt && isExpired(createdAt)

  if (!clientSecret && codeVerifier !== verifier) {
    return response.status(401).send({
      message: 'Invalid code verifier',
    })
  }

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
