import { Router } from 'express'
import { execute } from '../shared/database.js'
import { sendMail } from '../shared/mail.js'
import { isExpired } from '../shared/time.js'

const internal = Router()

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

export default internal
