import { Router } from 'express'
import {
  createApplication,
  getApplication,
  getAuthorizedApplications,
  getCreatedApplications,
} from '../data/application.js'
import { analyzer } from '../middlewares/analyzer.js'
import { parser } from '../middlewares/parser.js'
import { withUser } from '../middlewares/user.js'

const account = Router()

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

  if (!userId || !name || !callbackUrl) {
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

export default account
