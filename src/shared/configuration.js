import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

config()

const base = dirname(dirname(dirname(fileURLToPath(import.meta.url))))

export const directories = {
  base: base,
  pages: join(base, 'src/pages'),
  public: join(base, 'public'),
}

export const server = {
  port: process.env.SERVER_PORT,
}

export const port = server.port || 3000

export const database = {
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
