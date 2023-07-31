import { v4 } from 'uuid'
import { findAll, findOne, update } from '../shared/mongo.js'

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
export async function setUserRecord(userId, applicationId, { name, type, value, action }) {
  const user = await findOne({
    database: 'spot',
    collection: 'users',
    query: { uid: userId },
  })

  if (!user) return

  const applications = user.applications || []
  const application = applications.find(item => item.aid === applicationId)
  const records = application && application.records || {}
  const record = records && records[name]
  const collection = record && record.collection || v4()

  await update({
    database: 'spot',
    collection: 'users',
    filters: {
      _id: user._id,
      applications: { $elemMatch: { aid: applicationId } },
    },
    data: {
      $set: {
        [`applications.$.records.${name}`]: {
          collection,
          type: record && record.type || type,
        },
      }
    }
  })

  if (type === 'object') {
    switch (action) {
      default:
        await update({
          database: 'data',
          collection: collection,
          filters: { _type: 'object' },
          data: { $set: { ...value } },
          options: { upsert: true },
        })
    }
  } else if (type === 'list') {
    switch (action) {
      default:
    }
  }
}
