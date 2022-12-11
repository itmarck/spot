import cors from 'cors'
import { Router } from 'express'
import { getAvatarInSvg } from '../data/avatar.js'

const services = Router()

services.use(cors())

services.get('/avatars/:avatar', function (request, response) {
  const { avatar = 0 } = request.params

  response.header('Content-Type', 'image/svg+xml')

  response.send(getAvatarInSvg({ position: avatar }))
})

export default services
