import { createTransport } from 'nodemailer'
import { mail } from './configuration.js'
import { validate } from 'deep-email-validator'

const transport = createTransport({
  host: mail.host,
  port: mail.port,
  secure: true,
  auth: {
    user: mail.user,
    pass: mail.password,
  },
})

export function sendMail(to, { subject, message }) {
  const options = {
    from: {
      name: 'Spot',
      address: mail.user,
    },
    to: to,
    subject: subject,
    text: message,
  }

  const promise = transport.sendMail(options)

  promise.catch(function (error) {
    console.error(error)
  })
}

export async function isEmail(email = '') {
  const output = await validate({
    email,
    validateMx: false,
    validateSMTP: false,
  })
  return output && output.valid
}
