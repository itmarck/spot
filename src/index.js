import parser from 'body-parser'
import cors from 'cors'
import express from 'express'

import { directories, port } from './shared/configuration.js'

const server = express()

server.use(express.static(directories.public))

server.use(cors({}))
server.use(parser.json())
server.use(parser.urlencoded({ extended: true }))

server.get('/user', async function (request, response) {
  response.json({
    name: 'John Doe',
    email: 'john@example.com',
  })
})

server.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})
