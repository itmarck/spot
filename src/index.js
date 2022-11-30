import parser from 'cookie-parser'
import express from 'express'
import { api, internal, oauth } from './router/index.js'
import { directories, port } from './shared/configuration.js'

const server = express()

server.use(express.static(directories.public))

server.set('views', directories.pages)
server.set('view engine', 'pug')

server.use(parser())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use('/api/v1', api)
server.use('/oauth', oauth)
server.use('/_', internal)

server.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})
