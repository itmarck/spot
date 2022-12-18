import { Router } from 'express'
import { revokeAccess } from '../data/access.js'
import {
  createApplication,
  forgetApplication,
  getApplication,
  getAuthorizedApplications,
  getCreatedApplications,
  updateApplication,
} from '../data/application.js'
import { updateUser } from '../data/user.js'
import { analyzer } from '../middlewares/analyzer.js'
import { parser } from '../middlewares/parser.js'
import { withUser } from '../middlewares/user.js'
import { parseUrl } from '../shared/url.js'

const account = Router()

account.toString = () => '/account'

account.use(parser())
account.use(analyzer({ session: true }))
account.use(withUser)

account.get('/', async function (request, response) {
  const userId = request.userId
  const authorizedApplications = await getAuthorizedApplications(userId)

  response.render('account', {
    title: 'Mi cuenta',
    authorizedApplications,
  })
})

account.post('/', async function (request, response) {
  const userId = request.userId
  const name = request.body.name

  await updateUser(userId, { name })

  return response.redirect('/account')
})

account.get('/applications', async function (request, response) {
  const userId = request.userId
  const applications = await getCreatedApplications(userId)

  response.render('applications', {
    title: 'Mis aplicaciones',
    applications,
  })
})

account.post('/applications', async function (request, response) {
  const userId = request.userId
  const name = request.body['name']
  const description = request.body['description']
  const callbackUrl = request.body['callback_url']
  const redirectUri = parseUrl(callbackUrl)

  if (!userId || !name || !callbackUrl) {
    return response.render('error', {
      message: 'Faltan campos obligatorios',
    })
  }

  if (!redirectUri) {
    return response.render('error', {
      message: 'Callback URL no es válido',
    })
  }

  const slug = await createApplication({
    userId,
    name,
    description,
    redirectUri,
  })

  return response.redirect(`/account/applications/${slug}`)
})

account.get('/applications/:slug', async function (request, response) {
  const slug = request.params.slug
  const application = await getApplication(slug, {
    withSecret: true,
    bySlug: true,
  })

  if (!application) {
    return response.render('error', {
      message: 'Página no encontrada',
    })
  }

  response.render('application', {
    title: 'Opciones de la aplicación',
    application,
  })
})

account.post('/applications/:slug', async function (request, response) {
  const name = request.body['name']
  const avatar = request.body['avatar']
  const description = request.body['description']
  const callbackUrl = request.body['callback_url']
  const applicationId = request.body['application_id']
  const redirectUri = parseUrl(callbackUrl)

  if (!redirectUri) {
    return response.render('error', {
      message: 'Callback URL no es válido',
    })
  }

  await updateApplication(applicationId, {
    name,
    avatar,
    description,
    redirectUri,
  })

  return response.redirect('/account/applications')
})

account.post('/generate', async function (request, response) {
  const applicationId = request.body['application_id']
  const slug = request.body['slug']

  await forgetApplication(applicationId)

  return response.redirect(`/account/applications/${slug}`)
})

account.post('/revoke', async function (request, response) {
  const userId = request.userId
  const applicationId = request.body['application_id']

  await revokeAccess({ userId, applicationId })

  return response.redirect('/account')
})

export default account
