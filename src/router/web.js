import { Router } from 'express'
import { getAvatarInSvg } from '../data/avatar.js'

const web = Router()

web.get('/', function (request, response) {
  response.render('home', {
    title: 'Welcome to Spot',
  })
})

web.get('/login', function (request, response) {
  response.render('login', {
    title: 'Acceder a Spot',
    action: '/_/login',
  })
})

web.get('/avatars/:avatar', function (request, response) {
  const { avatar } = request.params

  response.header('Content-Type', 'image/svg+xml')

  response.send(getAvatarInSvg({ position: avatar }))
})

export default web
