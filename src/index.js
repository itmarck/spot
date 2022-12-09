import parser from 'cookie-parser'
import express from 'express'
import { api, internal, oauth, web } from './router/index.js'
import { directories, port, setup, version } from './shared/configuration.js'

const server = express()

server.locals.version = version

server.use(express.static(directories.public))

server.set('views', directories.templates)
server.set('view engine', 'pug')

server.use(setup())
server.use(parser())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use('/api/v1', api)
server.use('/oauth', oauth)
server.use('/_', internal)
server.use('/', web)

server.listen(port)
