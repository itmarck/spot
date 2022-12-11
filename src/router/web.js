import { Router } from 'express'
import { analizeInternalToken } from '../middlewares/token.js'
import { KEYS } from '../shared/constants.js'

const web = Router()

web.use(analizeInternalToken())

web.get('/', async function (request, response) {
  response.render('home', {
    title: 'Welcome to Spot',
  })
})

web.get('/account', function (request, response) {
  const loggedIn = response.locals.loggedIn

  if (!loggedIn) {
    return response.redirect('/login')
  }

  response.render('account', {
    title: 'Mi cuenta',
  })
})

web.get('/login', function (request, response) {
  const returnTo = request.query['return_to'] || '/'
  const loggedIn = response.locals.loggedIn
  const actionUrl = `/_/session?return_to=${encodeURIComponent(returnTo)}`

  if (loggedIn) {
    return response.redirect(returnTo)
  }

  response.render('login', {
    title: 'Acceder a Spot',
    action: actionUrl,
  })
})

web.get('/logout', function (request, response) {
  response.clearCookie(KEYS.internalToken)
  response.redirect('/')
})

export default web
