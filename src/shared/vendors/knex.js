// @ts-check

import setup from 'knex'
import { database } from '../configuration.js'

export const knex = setup({
  client: 'mysql2',
  connection: {
    host: database.host,
    port: parseInt(database.port || '3306'),
    user: database.user,
    password: database.password,
    database: database.name,
    pool: database.pool,
  },
})
