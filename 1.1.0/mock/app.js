'use strict'
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const short = require('short-uuid')
const jsonfile = require('jsonfile')

const PORT = 3001
const HOST = '0.0.0.0'
const SERVICE_NAME = 'papinet-mock'
const SERVICE_VERSION = '1.1.0'

const app = express()
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

const corsOptions = {}
app.use(cors(corsOptions))

const sessions = []
const sessionsIndexedByToken = []

// post /tokens
app.post('/tokens', (req, res) => {
  const traceId = short.uuid()
  console.log(`[INFO] [${traceId}] post /tokens [${Date.now()}] `)
  const id = short.uuid()
  const party = req.header('X-papiNet-Party')
  console.log(`[INFO] [${traceId}] post /tokens [${Date.now()}] party = ${party}`)
  const session = {
    id: id,
    token: id,
    party: party
  }
  sessions.push(session)
  sessionsIndexedByToken.push(session.token)
  res.status(201).json({
    access_token: session.token
  })
})

// get /debug
app.get('/debug', (req, res) => {
  return res.status(200).send(sessions);
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
