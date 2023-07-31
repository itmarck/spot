import { execute } from '../shared/database.js'
import { findAll, findOne } from '../shared/mongo.js'

export async function getUserRecord(userId, applicationId, { name }) {
  const user = await findOne({
    database: 'spot',
    collection: 'users',
    query: { uid: userId },
  })

  if (!user) return

  const application = user.applications.find(item => item.aid === applicationId)
  const records = application && application.records
  const record = records && records[name]
  const collection = record && record.collection
  const type = record && record.type

  if (!collection) return

  const list = await findAll({ database: 'data', collection })

  if (!list) return

  return type === 'object' && list.length > 0 ? list[0] : list
}

/**
 * Get all record names from the database. If a name is provided, only that
 * record will be returned.
 *
 * @param {number} userId User identifier.
 * @param {number} applicationId Application identifier.
 * @param {object} options
 * @param {string} options.name Record name to filter just one record.
 */
export async function getRecords(userId, applicationId, { name } = {}) {
  return
}

/**
 * Set a record in the database. If the record does not exist, it will be
 * created. If it exists, it will be updated.
 *
 * @param {number} userId User identifier.
 * @param {number} applicationId Application identifier.
 * @param {object} options
 * @param {string} options.name Record name where the value will be stored.
 * @param {object} options.value Parsable record value in JSON.
 */
export async function setRecord(userId, applicationId, { name, value }) {
  const record = await getUserRecord(userId, applicationId, { name })
  const recordId = record && record.id
  const parsedValue = value && JSON.stringify(value)
  const insertQuery = `
    INSERT INTO record (name, value, user, application)
    VALUES ('${name}', '${parsedValue}', '${userId}', '${applicationId}')
  `
  const updateQuery = `
    UPDATE record
    SET value = '${parsedValue}'
    WHERE id = '${recordId}'
  `
  const query = recordId ? updateQuery : insertQuery

  await execute(query)
}

/**
 * Delete a record from the database. This action is irreversible.
 *
 * @param {number} userId User identifier.
 * @param {number} applicationId Application identifier.
 * @param {object} options
 * @param {string} options.name Record name to delete.
 */
export async function deleteRecord(userId, applicationId, { name }) {
  const query = `
    DELETE FROM record
    WHERE user = '${userId}'
    AND application = '${applicationId}'
    AND name = '${name}'
  `

  await execute(query)
}
