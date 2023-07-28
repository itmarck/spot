import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

config()

const base = dirname(dirname(dirname(fileURLToPath(import.meta.url))))

const server = {
  host: process.env.SERVER_HOST,
  port: process.env.SERVER_PORT,
}

export function setup() {
  return function (request, response, next) {
    const { protocol, hostname } = request

    if (!server.host) {
      server.host = `${protocol}://${hostname}`
    }

    response.locals.links = links
    response.locals.year = new Date().getFullYear()

    next()
  }
}

export function host() {
  return server.host || ''
}

export const port = server.port || 3000
export const version = process.env.npm_package_version

export const links = {
  creator: 'https://itmarck.com',
  github: 'https://github.com/itmarck/spot',
  pulls: 'https://github.com/itmarck/spot/pulls',
  issues: 'https://github.com/itmarck/spot/issues',
  home: '/',
  account: '/account',
  apps: '/account/applications',
  documentation: '/docs',
  oauth: 'https://oauth.net/2',
}

export const directories = {
  base: base,
  public: join(base, 'public'),
  templates: join(base, 'src/templates'),
}

export const database = {
  uri: process.env.MONGODB_URI,
  name: process.env.MYSQLDATABASE,
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}

export const mail = {
  host: process.env.MAILHOST,
  port: process.env.MAILPORT,
  user: process.env.MAILUSER,
  password: process.env.MAILPASSWORD,
}

export const jwt = {
  secret: process.env.JWT_SECRET,
}
