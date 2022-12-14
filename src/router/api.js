import cors from 'cors'
import { Router } from 'express'
import { deleteRecord, getRecords, setRecord } from '../data/record.js'
import { getUser } from '../data/user.js'
import { analyzeContext } from '../middlewares/token.js'
import { CONTEXTS } from '../shared/constants.js'

const api = Router()

api.use(cors())
api.use(analyzeContext(CONTEXTS.api))

api.get('/user', async function (request, response) {
  const { payload: { uid } = {} } = request
  const user = await getUser(uid)

  if (!user) {
    return response.status(404).send()
  }

  response.send(user)
})

api.get('/user/records', async function (request, response) {
  const { payload: { uid, aid } = {} } = request
  const records = await getRecords(uid, aid)

  if (!records) {
    return response.status(404).send()
  }

  response.send(records)
})

api.get('/user/records/:name', async function (request, response) {
  const { params: { name } = {}, payload } = request
  const { uid, aid } = payload
  const record = await getRecords(uid, aid, { name })

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
  const record = await getRecords(uid, aid, { name })

  if (!record) {
    return response.status(404).send()
  }

  await deleteRecord(uid, aid, { name })

  response.send({ name })
})

export default api
