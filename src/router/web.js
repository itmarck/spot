import { Router } from 'express'
import { getAvatarInSvg } from '../data/avatar.js'
import { getUser } from '../data/user.js'
import { host } from '../shared/configuration.js'
import { CONTEXTS, KEYS } from '../shared/constants.js'
import { verify } from '../shared/jwt.js'

const web = Router()

web.get('/', async function (request, response) {
  const { cookies = {} } = request
  const internalToken = cookies[KEYS.internalToken]
  const { uid, context } = verify(internalToken) || {}
  const hasAccess = uid && context === CONTEXTS.internal
  const user = await getUser(uid)

  response.render('home', {
    title: 'Welcome to Spot',
    user: hasAccess && user,
  })
})

web.get('/login', function (request, response) {
  const { cookies = {}, query = {} } = request
  const returnTo = query['return_to'] || '/'
  const actionUrl = `/_/session?return_to=${returnTo}`
  const internalToken = cookies[KEYS.internalToken]
  const { uid, context } = verify(internalToken) || {}

  if (uid && context === CONTEXTS.internal) {
    return response.redirect(returnTo)
  }

  response.render('login', {
    title: 'Acceder a Spot',
    action: actionUrl,
  })
})

web.get('/logout', function (request, response) {
  const { query = {} } = request
  const returnTo = query['return_to'] || '/'

  response.clearCookie(KEYS.internalToken)
  response.redirect(returnTo)
})

web.get('/avatars/:avatar', function (request, response) {
  const { avatar } = request.params

  response.header('Content-Type', 'image/svg+xml')

  response.send(getAvatarInSvg({ position: avatar }))
})

export default web
