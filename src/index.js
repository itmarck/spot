import parser from 'cookie-parser'
import express from 'express'
import { account, api, internal, oauth, web } from './router/index.js'
import { directories, port, setup, version } from './shared/configuration.js'

const server = express()

server.locals.version = version

server.use(express.static(directories.public))

server.set('view engine', 'pug')
server.set('views', directories.templates)

server.use(setup())
server.use(parser())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(`${api}`, api)
server.use(`${account}`, account)
server.use(`${oauth}`, oauth)
server.use(`${internal}`, internal)
server.use(`${web}`, web)

server.listen(port, function () {
  console.info(`Listening on port ${port}`)
})
