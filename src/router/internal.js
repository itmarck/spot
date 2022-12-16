import { Router } from 'express'
import { createSession, getSession } from '../data/session.js'
import { getOrCreateUser, getUser } from '../data/user.js'
import { parser } from '../middlewares/parser.js'
import { CONTEXTS, KEYS } from '../shared/constants.js'
import { sign } from '../shared/jwt.js'
import { isEmail, sendMail } from '../shared/mail.js'
import { canSendCode, isExpired } from '../shared/time.js'

const internal = Router()

internal.use(parser())

internal.post('/code', async function (request, response) {
  const { body: { email } = {} } = request

  if (!(await isEmail(email))) {
    return response.status(400).send({
      message: 'El correo es no es válido',
    })
  }

  const user = await getOrCreateUser(email)
  const session = await getSession({ userId: user.id })
  const sessionCreatedTime = session && session.createdAt

  if (!canSendCode(sessionCreatedTime)) {
    return response.send({
      message: 'Ya se ha enviado un código recientemente',
    })
  }

  const code = await createSession({ userId: user.id })

  sendMail(email, {
    subject: 'Código de inicio de sesión',
    message: `Usa este código para iniciar sesión en Spot: ${code}`,
  })

  response.send({
    message: `Se ha enviado el código a ${email}`,
  })
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
  const session = await getSession({ userId })
  const sessionCode = session && session.code
  const sessionCreatedTime = session && session.createdAt

  if (sessionCode !== code) {
    return response.render('error', {
      message: 'El código no es válido',
    })
  }

  if (isExpired(sessionCreatedTime)) {
    return response.render('error', {
      message: 'El código ha expirado',
    })
  }

  const internalToken = sign(CONTEXTS.internal, { uid: userId })
  response.cookie(KEYS.internalToken, internalToken)
  response.redirect(returnTo)
})

export default internal
