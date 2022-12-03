import { Record } from '../core/record.js'
import { execute } from '../shared/database.js'

async function getRecord(userId, applicationId, { name }) {
  const query = `
    SELECT * FROM record
    WHERE user = '${userId}'
    AND application = '${applicationId}'
    AND name = '${name}'
  `
  const data = await execute(query, { as: 'object' })

  return data && Record.fromJSON(data)
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
  if (name) {
    return getRecord(userId, applicationId, { name })
  }

  const query = `
    SELECT name FROM record
    WHERE user = '${userId}'
    AND application = '${applicationId}'
    ORDER BY name ASC
  `
  const data = await execute(query, { as: 'array' })
  const mapper = ({ name }) => name

  return data && data.map(mapper)
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
  const record = await getRecord(userId, applicationId, { name })
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
