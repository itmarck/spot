import parser from 'body-parser'
import cors from 'cors'
import express from 'express'

import { port } from './shared/configuration.js'

const app = express()

app.use(cors({}))
app.use(parser.json())
app.use(parser.urlencoded({ extended: true }))

app.get('/', async function (request, response) {
  response.json({ message: 'Welcome to the API!' })
})

app.get('/user', async function (request, response) {
  response.json({ message: 'Hi, I am a user!' })
})

app.listen(port, function () {
  console.log(`Server is running on port ${port}`)
})
