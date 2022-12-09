import { Router } from 'express'
import { createSession, getSession } from '../data/session.js'
import { getOrCreateUser, getUser } from '../data/user.js'
import { CONTEXTS, KEYS } from '../shared/constants.js'
import { sign } from '../shared/jwt.js'
import { sendMail } from '../shared/mail.js'
import { isExpired } from '../shared/time.js'

const internal = Router()

internal.post('/code', async function (request, response) {
  const { body: { email } = {} } = request

  if (!email) {
    return response.status(400).send({
      message: 'Missing email',
    })
  }

  const user = await getOrCreateUser(email)
  const code = await createSession({ userId: user.id })

  try {
    sendMail(email, {
      subject: 'Código de inicio de sesión',
      message: `Usa este código para iniciar sesión en Spot: ${code}`,
    })
  } catch (error) {
    console.error(error)
  }

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
