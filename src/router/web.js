import cors from 'cors'
import { Router } from 'express'
import { getAvatarInSvg } from '../data/avatar.js'
import { authorization, reference, starter } from '../data/documentation.js'
import { parser } from '../middlewares/parser.js'
import { withUser } from '../middlewares/user.js'
import { host } from '../shared/configuration.js'
import { KEYS } from '../shared/constants.js'
import api from './api.js'

const web = Router()

web.toString = () => '/'

web.use(cors())
web.use(parser())

web.get('/', withUser, async function (request, response) {
  response.render('home', {
    title: 'Bienvenido a Spot',
  })
})

web.get('/docs', withUser, function (request, response) {
  const hostname = host()

  response.locals.location = {}
  response.locals.location.origin = hostname
  response.locals.location.api = `${api}`

  return response.render('documentation', {
    title: 'Documentación',
    docs: {
      introduction: starter,
      authorization: authorization,
      api: reference,
    },
  })
})

web.get('/login', function (request, response) {
  const loggedIn = response.locals.loggedIn
  const returnTo = request.query['return_to'] || '/'
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
  const avatar = request.params.avatar
  const position = parseInt(avatar) || 0
  const svg = getAvatarInSvg({ position })

  response.header('Content-Type', 'image/svg+xml')

  response.send(svg)
})

export default web
