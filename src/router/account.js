import { Router } from 'express'
import {
  createApplication,
  getApplication,
  getAuthorizedApplications,
  getCreatedApplications,
} from '../data/application.js'
import { analizeInternalToken } from '../middlewares/token.js'

const account = Router()

account.use(analizeInternalToken())

account.get('/', async function (request, response) {
  const loggedIn = response.locals.loggedIn
  const user = response.locals.user
  const userId = user && user.id

  if (!loggedIn) {
    return response.redirect('/login')
  }

  const authorizedApplications = await getAuthorizedApplications(userId)

  response.render('account', {
    title: 'Mi cuenta',
    authorizedApplications,
  })
})

account.get('/applications', async function (request, response) {
  const loggedIn = response.locals.loggedIn
  const user = response.locals.user
  const userId = user && user.id

  if (!loggedIn) {
    return response.redirect('/login')
  }

  const applications = await getCreatedApplications(userId)

  response.render('applications', {
    title: 'Mis aplicaciones',
    applications,
  })
})

function parseBody(body) {
  return {
    name: body['name'],
    description: body['description'],
    callbackUrl: body['callback_url'],
  }
}

account.post('/applications', async function (request, response) {
  const loggedIn = response.locals.loggedIn
  const user = response.locals.user
  const userId = user && user.id

  if (!loggedIn) {
    return response.redirect('/login')
  }

  const { name, description, callbackUrl } = parseBody(request.body)

  if (!name || !callbackUrl) {
    return response.render('error', {
      message: 'Faltan campos obligatorios',
    })
  }

  const slug = await createApplication({
    userId,
    name,
    description,
    redirectUri: callbackUrl,
  })

  return response.redirect(`/account/applications/${slug}`)
})

account.get('/applications/:slug', async function (request, response) {
  const loggedIn = response.locals.loggedIn
  const slug = request.params.slug

  if (!loggedIn) {
    return response.redirect(`/login?return_to=${request.url}`)
  }

  const application = await getApplication(slug, {
    withSecret: true,
    bySlug: true,
  })

  if (!application) {
    return response.redirect('/account/applications')
  }

  response.render('application', {
    title: 'Opciones de la aplicación',
    application,
  })
})

export default account
