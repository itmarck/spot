import { Router } from 'express'

const web = Router()

web.get('/', function (request, response) {
  response.render('home', {
    title: 'Welcome to Spot',
  })
})

export default web
