import parser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { directories, port } from './shared/configuration.js'

const server = express()

server.use(express.static(directories.public))

server.set('views', directories.pages)
server.set('view engine', 'pug')

server.use(cors({}))
server.use(parser())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

const api = express.Router()
const oauth = express.Router()
const internal = express.Router()

const testClient = {
  id: 'test',
  secret: '123456',
  code: '1234',
  token: 'KDx2HG5K71',
}

api.get('/user', async function (request, response) {
  const { headers } = request
  const authorization = headers['authorization'] || ' '
  const [type, value] = authorization.split(' ')

  if (value !== testClient.token) {
    response.status(401).send(`${type} Unauthorized`)
    return
  }

  response.json({
    name: 'John Doe',
    email: 'john@example.com',
  })
})

oauth.get('/authorize', function ({ query, cookies }, response) {
  response.render('authorize', {
    client: query['client_id'],
    secret: query['client_secret'],
    redirect: query['redirect_uri'],
    scope: query['scope'],
    state: query['state'],
    token: cookies['access_token'],
    responseType: query['response_type'],
  })
})

oauth.post('/token', function (request, response) {
  const { body } = request
  const { grant_type, code, client_id } = body

  response.json({
    token_type: 'Bearer',
    access_token: testClient.token,
  })
})

internal.post('/login', function (request, response) {
  const { query, body } = request
  const { redirect } = query

  response.redirect(301, `${redirect}?code=${testClient.code}`)
})

server.use('/api/v1', api)
server.use('/oauth', oauth)
server.use('/_', internal)

server.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})
