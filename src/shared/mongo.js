import { MongoClient } from 'mongodb'
import { database } from './configuration.js'

const client = new MongoClient(database.uri)

export async function findAll({ database, collection, query = {} }) {
  await client.connect()
  const cursor = client.db(database).collection(collection)
  const response = await cursor.find(query).toArray()
  await client.close()
  return response
}

export async function findOne({ database, collection, query = {} }) {
  await client.connect()
  const cursor = client.db(database).collection(collection)
  const response = await cursor.findOne(query)
  await client.close()
  return response
}

export async function insert({ database, collection, data }) {
  await client.connect()
  const cursor = client.db(database).collection(collection)
  const response = await cursor.insertOne(data)
  await client.close()
  return response
}