import cors from 'cors'
import { Router } from 'express'
import { getAvatarInSvg } from '../data/avatar.js'
import { analizeInternalToken } from '../middlewares/token.js'
import { KEYS } from '../shared/constants.js'

const web = Router()

web.use(cors())
web.use(analizeInternalToken())

web.get('/', async function (request, response) {
  response.render('home', {
    title: 'Welcome to Spot',
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

web.get('/avatars/:avatar', function (request, response) {
  const { avatar = 0 } = request.params

  response.header('Content-Type', 'image/svg+xml')

  response.send(getAvatarInSvg({ position: avatar }))
})

export default web
