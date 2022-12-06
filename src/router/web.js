import { Router } from 'express'

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

export default web
