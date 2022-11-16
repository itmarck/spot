import { config } from 'dotenv'

config()

export const server = {
  port: process.env.PORT,
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
