import { createTransport } from 'nodemailer'
import { mail } from './configuration.js'

const transport = createTransport({
  host: mail.host,
  port: mail.port,
  secure: true,
  auth: {
    user: mail.user,
    pass: mail.password,
  },
})

export async function sendMail(to, { subject, message }) {
  const options = {
    from: {
      name: 'Spot',
      address: mail.user,
    },
    to: to,
    subject: subject,
    text: message,
  }

  return new Promise(function (resolve, reject) {
    transport.sendMail(options, function (error, data) {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}
