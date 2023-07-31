import cors from 'cors'
import { Router } from 'express'
import { deleteRecord, getUserRecord, setRecord } from '../data/record.js'
import { getUser } from '../data/user.js'
import { analyzer } from '../middlewares/analyzer.js'
import { parser } from '../middlewares/parser.js'
import { CONTEXTS } from '../shared/constants.js'

const api = Router()

api.toString = () => '/api/v1'

api.use(cors())
api.use(parser({ from: CONTEXTS.api }))
api.use(analyzer({ context: CONTEXTS.api, access: true }))

api.get('/user', async function (request, response) {
  const { payload: { uid } = {} } = request
  const user = await getUser(uid)

  if (!user) {
    return response.status(404).send()
  }

  response.send(user)
})

api.get('/user/records/:name', async function (request, response) {
  const { params: { name } = {}, payload } = request
  const { uid, aid } = payload
  const record = await getUserRecord(uid, aid, { name })

  if (!record) {
    return response.status(404).send()
  }

  response.send(record)
})

api.post('/user/records/:name', async function (request, response) {
  const { params: { name } = {}, body = {}, payload } = request
  const { uid, aid } = payload
  const { value } = body

  await setRecord(uid, aid, { name, value })

  response.send({ name, value })
})

api.delete('/user/records/:name', async function (request, response) {
  const { params: { name } = {}, payload } = request
  const { uid, aid } = payload
  const record = await getUserRecord(uid, aid, { name })

  if (!record) {
    return response.status(404).send()
  }

  await deleteRecord(uid, aid, { name })

  response.send({ name })
})

export default api
