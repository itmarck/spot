import { createPool } from 'mysql2'
import { database } from './configuration.js'

const options = {
  database: database.name,
  host: database.host,
  port: database.port,
  user: database.user,
  password: database.password,
  pool: database.pool,
}

const pool = createPool(options)

export async function execute(sql, { as } = {}) {
  return new Promise(function (resolve, reject) {
    pool.query(sql, function (error, rows = []) {
      if (error) {
        return reject(error)
      }

      if (rows.length === 0) {
        return resolve()
      }

      switch (as) {
        case 'array':
          return resolve(Array.from(rows))
        case 'object':
          return resolve(rows[0])
        default:
          return resolve(rows)
      }
    })
  })
}
