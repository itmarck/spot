import parser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { directories, port } from './shared/configuration.js'
import { execute } from './shared/database.js'
import { sendMail } from './shared/mail.js'
import { isExpired } from './shared/time.js'

const server = express()

server.use(express.static(directories.public))

server.set('views', directories.pages)
server.set('view engine', 'pug')

server.use(parser())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

const api = express.Router()
const oauth = express.Router()
const internal = express.Router()

api.use(cors())
oauth.use(cors())

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

internal.post('/code', async function (request, response) {
  const { query: { email } = {} } = request

  if (!email) {
    response.status(400).send('Missing email')
    return
  }

  let [user] = await execute(`SELECT * FROM user WHERE email = '${email}'`)

  if (!user) {
    const name = email.split('@')[0]
    await execute(
      `INSERT INTO user (email, name) VALUES ('${email}', '${name}')`,
    )
    const [newUser] = await execute(
      `SELECT * FROM user WHERE email = '${email}'`,
    )
    user = newUser
  }

  const code = Math.floor(100000 + Math.random() * 900000)
  await execute(
    `INSERT INTO session (user, type, code) VALUES (${user.id}, 1, '${code}')`,
  )

  sendMail(email, {
    subject: 'Código de inicio de sesión',
    message: `${code}`,
  })

  response.status(204).send()
})

internal.post('/login', async function (request, response) {
  const { body: { email, code } = {} } = request

  if (!email || !code) {
    response.status(400).send('Email and code are required')
    return
  }

  const [user] = await execute(`SELECT * FROM user WHERE email = '${email}'`)
  const sessions = await execute(
    `SELECT * FROM session WHERE user = ${user.id}`,
  )

  const session = sessions.at(-1)
  const sessionCode = session && session.code
  const sessionCreatedTime = session && session.created_at

  if (sessionCode !== code) {
    response.status(401).send({
      message: 'Invalid code',
    })
    return
  }

  if (isExpired(sessionCreatedTime)) {
    response.status(401).send({
      message: 'Expired code',
    })
    return
  }

  response.status(204).send()
})

server.use('/api/v1', api)
server.use('/oauth', oauth)
server.use('/_', internal)

server.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})
