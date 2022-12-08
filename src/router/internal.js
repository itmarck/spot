import { Router } from 'express'
import { getSession } from '../data/session.js'
import { getUser } from '../data/user.js'
import { CONTEXTS, KEYS } from '../shared/constants.js'
import { execute } from '../shared/database.js'
import { sign } from '../shared/jwt.js'
import { sendMail } from '../shared/mail.js'
import { isExpired } from '../shared/time.js'

const internal = Router()

internal.post('/code', async function (request, response) {
  const { body: { email } = {} } = request

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

internal.post('/session', async function (request, response) {
  const { body: { email, code } = {}, query = {} } = request
  const returnTo = query['return_to'] || '/'

  if (!email || !code) {
    return response.status(400).send({
      message: 'Missing email or code',
    })
  }

  const user = await getUser(email, { byEmail: true })
  const userId = user && user.id
  const session = await getSession({ user: userId })
  const sessionCode = session && session.code
  const sessionCreatedTime = session && session.createdAt

  if (sessionCode !== code) {
    return response.status(401).send({
      message: 'Invalid code',
    })
  }

  if (isExpired(sessionCreatedTime)) {
    return response.status(401).send({
      message: 'Expired code',
    })
  }

  const internalToken = sign(CONTEXTS.internal, { uid: userId })
  response.cookie(KEYS.internalToken, internalToken)
  response.redirect(returnTo)
})

export default internal
