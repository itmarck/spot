import cors from 'cors'
import { Router } from 'express'

const api = Router()

api.use(cors())

api.get('/user', async function (request, response) {
  const { headers } = request
  const authorization = headers['authorization'] || ' '
  const [type, value] = authorization.split(' ')

  if (value !== 'KDx2HG5K71') {
    response.status(401).send(`${type} Unauthorized`)
    return
  }

  response.json({
    name: 'John Doe',
    email: 'john@example.com',
  })
})

export default api
