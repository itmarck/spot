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

export async function execute(sql) {
  return new Promise(function (resolve, reject) {
    pool.query(sql, function (error, result) {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
