import { MongoClient } from 'mongodb'
import { database } from './configuration.js'

export const client = new MongoClient(database.uri)
