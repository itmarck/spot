import parser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { directories, port } from './shared/configuration.js'

const server = express()

server.use(express.static(directories.public))

server.set('views', directories.pages)
server.set('view engine', 'pug')

server.use(cors({}))
server.use(parser())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

const api = express.Router()
const oauth = express.Router()

api.get('/user', async function (request, response) {
  response.json({
    name: 'John Doe',
    email: 'john@example.com',
  })
})


server.use('/api/v1', api)
server.use('/oauth', oauth)

server.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})
