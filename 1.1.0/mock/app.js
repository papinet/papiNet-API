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

const scenarios = [
  {
    method: "GET",
    domain:"papinet.papinet.io",
    path: "/orders",
    useCase: "order-status-use-case",
    name: "_",
    firstStep: 0,
    lastStep: 0,
    previousStep: -1
  },
  {
    method: "GET",
    domain:"papinet.papinet.io",
    path: "/orders/c51d8903-01d1-485c-96ce-51a9be192207",
    useCase: "order-status-use-case",
    name: "A",
    firstStep: 1,
    lastStep: 1,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.road.papinet.io",
    path: "/shipments",
    useCase: "shipment-use-case",
    name: "A",
    firstStep: 2,
    lastStep: 2,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.road.papinet.io",
    path: "/shipments/c51d8903-01d1-485c-96ce-51a9be192207",
    useCase: "shipment-use-case",
    name: "A",
    shipmentId: "c51d8903-01d1-485c-96ce-51a9be192207",
    party: "Road",
    firstStep: 3,
    lastStep: 7,
    previousStep: 0
  },
  {
    path: "/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
    useCase: "shipment-use-case",
    name: "B",
    shipmentId: "3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
    party: "Fast",
    firstStep: 3,
    lastStep: 7,
    previousStep: 0
  },
  {
    path: "/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
    useCase: "shipment-use-case",
    name: "C",
    shipmentId: "d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
    party: "Pulp",
    firstStep: 3,
    lastStep: 7,
    previousStep: 0
  }
]
const scenariosIndexedByParty = [
  "GET|papinet.papinet.io|/orders",
  "GET|papinet.papinet.io|/orders/c51d8903-01d1-485c-96ce-51a9be192207",
  "GET|papinet.road.papinet.io|/shipments",
  "Road",
  "Fast",
  "Pulp"
]
const scenariosIndexedByAPIEndpoint = [
  "GET|papinet.papinet.io|/orders",
  "GET|papinet.papinet.io|/orders/c51d8903-01d1-485c-96ce-51a9be192207",
  "GET|papinet.road.papinet.io|/shipments",
  "GET|papinet.road.papinet.io|/shipments/c51d8903-01d1-485c-96ce-51a9be192207",
  "GET|papinet.road.papinet.io|/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
  "GET|papinet.road.papinet.io|/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17"
]

// post /tokens
app.post('/tokens', (req, res) => {
  const traceId = short.uuid()
  console.log(`[INFO] [${traceId}] post /tokens [${Date.now()}] `)
  const id = short.uuid()
  // Depreacted:
  const party = req.header('X-papiNet-Party')
  console.log(`[INFO] [${traceId}]   party = ${party} [${Date.now()}]`)
  // Replaced By:
  const domain = req.header('X-papiNet-Domain')
  console.log(`[INFO] [${traceId}]   domain = ${domain} [${Date.now()}]`)

  const scenarioPos = scenariosIndexedByParty.indexOf(party)
  console.log(`[INFO] [${traceId}]   scenarioPos: ${scenarioPos}`)

  // This is the (ONLY) good way to make a genuine COPY!!!
  const sessionScenario = JSON.parse(JSON.stringify(scenarios[scenarioPos]));

  const session = {
    id: id,
    token: id,
    domain: domain,
    party: party,
    scenario: sessionScenario,
    scenarioActivated: false
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

// get /orders
app.get('/orders', (req, res) => {
  const traceId = short.uuid()
  console.log(`[INFO] [${traceId}] get /orders [${Date.now()}]`)

  const method = 'GET'
  console.log(`[INFO] [${traceId}]   method: ${method}`)
  const domain = req.header('X-papiNet-Domain')
  console.log(`[INFO] [${traceId}]   domain: ${domain}`)
  const path = '/orders'
  console.log(`[INFO] [${traceId}]   path: ${path}`)

  const authorization = req.headers.authorization
  console.log(`[INFO] [${traceId}]   authorization: ${authorization} [${Date.now()}]`)

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "ERR-04",
        message: "Cannot get a bearer token :-("
      }
    })
  }

  const token = authorization.substring(7, authorization.length)
  console.log(`[INFO] [${traceId}]   token: ${token}`)

  const sessionPos = sessionsIndexedByToken.indexOf(token)
  console.log(`[INFO] [${traceId}]   sessionPos: ${sessionPos}`)

  if (sessionPos === -1) {
    return res.status(401).json({
      error: {
        code: "ERR-05",
        message: "Cannot retrieve the session based on the Bearer token :-("
      }
    })
  }

  const sessionDomain = sessions[sessionPos].domain
  console.log(`[INFO] [${traceId}]   sessionDomain: ${sessionDomain}`)

  if (sessionDomain !== domain) {
    return res.status(401).json({
      error: {
        code: "ERR-06",
        message: "The 'X-papiNet-Domain' does not correpsond to the session's party :("
      }
    })
  }

  const apiEnpoint = `${method}|${domain}|${path}`
  console.log(`[INFO] [${traceId}]   apiEnpoint: ${apiEnpoint}`)

  const scenarioPos = scenariosIndexedByAPIEndpoint.indexOf(apiEnpoint)
  console.log(`[INFO] [${traceId}]   scenarioPos: ${scenarioPos}`)

  // This is the (ONLY) good way to make a genuine COPY!!!
  const sessionScenario = JSON.parse(JSON.stringify(scenarios[scenarioPos]))

  if (sessions[sessionPos].scenarioActivated === false) {
    sessions[sessionPos].scenario = sessionScenario
    sessions[sessionPos].scenarioActivated = true
  }

  const sessionScenarioName = sessions[sessionPos].scenario.name
  console.log(`[INFO] [${traceId}]   sessionScenarioName: ${sessionScenarioName}`)

  const sessionScenarioUseCase = sessions[sessionPos].scenario.useCase
  console.log(`[INFO] [${traceId}]   sessionScenarioUseCase: ${sessionScenarioUseCase}`)

  const firstStep = sessions[sessionPos].scenario.firstStep
  console.log(`[INFO] [${traceId}]   firstStep: ${firstStep}`)
  const lastStep = sessions[sessionPos].scenario.lastStep
  console.log(`[INFO] [${traceId}]   lastStep: ${lastStep}`)
  const previousStep = sessions[sessionPos].scenario.previousStep
  console.log(`[INFO] [${traceId}]   previousStep: ${previousStep}`)

  let currentStep = -1
  if (previousStep < firstStep) {
    currentStep = firstStep
  }
  else if (previousStep < lastStep) {
    currentStep = previousStep + 1
  }
  else if (previousStep >= lastStep) {
    currentStep = lastStep
  }
  console.log(`[INFO] [${traceId}]   currentStep: ${currentStep}`)

  sessions[sessionPos].scenario.previousStep = currentStep

  const sourceFileName = `./samples/${sessionScenarioUseCase}.${sessionScenarioName}.step-${currentStep}.json`;
  console.log(`[INFO] [${traceId}]   sourceFileName: ${sourceFileName}`);

  let source = {}
  try {
    source = jsonfile.readFileSync(sourceFileName) // MUST be changed to async
  } catch (err) {
    return res.status(404).json({
      error: {
        code: "ERR-06",
        message: `Cannot find the file \'${sourceFileName}\'.`
      }
    })
  }

  return res.status(200).send(source)
})

// get /shipments
app.get('/shipments', (req, res) => {
  const traceId = short.uuid()
  console.log(`[INFO] [${traceId}] get /shipments [${Date.now()}]`)
  const authorization = req.headers.authorization
  console.log(`[INFO] [${traceId}]   authorization: ${authorization} [${Date.now()}]`)

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "ERR-04",
        message: "Cannot get a bearer token :-("
      }
    })
  }

  const token = authorization.substring(7, authorization.length)
  console.log(`[INFO] [${traceId}]   token: ${token}`)

  const sessionPos = sessionsIndexedByToken.indexOf(token)
  console.log(`[INFO] [${traceId}]   sessionPos: ${sessionPos}`)

  if (sessionPos === -1) {
    return res.status(401).json({
      error: {
        code: "ERR-05",
        message: "Cannot retrieve the session based on the Bearer token :-("
      }
    })
  }

  const sessionParty = sessions[sessionPos].party
  console.log(`[INFO] [${traceId}]   sessionParty: ${sessionParty}`)

  const party = req.header('X-papiNet-Party')
  console.log(`[INFO] [${traceId}]   party: ${party}`)

  if (sessionParty !== party) {
    return res.status(401).json({
      error: {
        code: "ERR-06",
        message: "The 'X-papiNet-Party' does not correpsond to the session's party :("
      }
    })
  }

  const sessionScenarioName = sessions[sessionPos].scenario.name
  console.log(`[INFO] [${traceId}]   sessionScenarioName: ${sessionScenarioName}`)

  const sourceFileName = `./samples/shipment-use-case.${sessionScenarioName}.step-2.json`;
  console.log(`[INFO] [${traceId}]   sourceFileName: ${sourceFileName}`);

  let source = {}
  try {
    source = jsonfile.readFileSync(sourceFileName) // MUST be changed to async
  } catch (err) {
    return res.status(404).json({
      error: {
        code: "ERR-06",
        message: `Cannot find the file \'${sourceFileName}\'.`
      }
    })
  }

  return res.status(200).send(source)
})

// get /shipments/{shipmentId}
app.get('/shipments/:shipmentId', (req, res) => {
  const traceId = short.uuid();
  const shipmentId = req.params.shipmentId;
  console.log(`[INFO] [${traceId}] get /shipments/${shipmentId} [${Date.now()}]`)
  const authorization = req.headers.authorization;
  console.log(`[INFO] [${traceId}]   authorization: ${authorization} [${Date.now()}]`)

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "ERR-04",
        message: "Cannot get a bearer token :-("
      }
    })
  }

  const token = authorization.substring(7, authorization.length)
  console.log(`[INFO] [${traceId}]   token: ${token}`)

  const sessionPos = sessionsIndexedByToken.indexOf(token)
  console.log(`[INFO] [${traceId}]   sessionPos: ${sessionPos}`)

  if (sessionPos === -1) {
    return res.status(401).json({
      error: {
        code: "ERR-05",
        message: "Cannot retrieve the session based on the Bearer token :-("
      }
    })
  }

  const sessionParty = sessions[sessionPos].party
  console.log(`[INFO] [${traceId}]   sessionParty: ${sessionParty}`)

  const party = req.header('X-papiNet-Party')
  console.log(`[INFO] [${traceId}]   party: ${party}`)

  if (sessionParty !== party) {
    return res.status(401).json({
      error: {
        code: "ERR-06",
        message: "The 'X-papiNet-Party' does not correpsond to the session's party :("
      }
    })
  }

  const sessionScenarioName = sessions[sessionPos].scenario.name
  console.log(`[INFO] [${traceId}]   sessionScenarioName: ${sessionScenarioName}`)

  const sessionShipmentId = sessions[sessionPos].scenario.shipmentId
  console.log(`[INFO] [${traceId}]   sessionShipmentId: ${sessionShipmentId}`)

  if (sessionShipmentId !== shipmentId) {
    return res.status(404).json({
      error: {
        code: "ERR-XX",
        message: "The shipment ${shipmentId} was NOT FOUND :-("
      }
    })
  }

  const firstStep = sessions[sessionPos].scenario.firstStep
  console.log(`[INFO] [${traceId}]   firstStep: ${firstStep}`)
  const lastStep = sessions[sessionPos].scenario.lastStep
  console.log(`[INFO] [${traceId}]   lastStep: ${lastStep}`)
  const previousStep = sessions[sessionPos].scenario.previousStep
  console.log(`[INFO] [${traceId}]   previousStep: ${previousStep}`)

  let currentStep = -1
  if (previousStep < firstStep) {
    currentStep = firstStep
  }
  else if (previousStep < lastStep) {
    currentStep = previousStep + 1
  }
  else if (previousStep >= lastStep) {
    currentStep = lastStep
  }
  console.log(`[INFO] [${traceId}]   currentStep: ${currentStep}`)

  sessions[sessionPos].scenario.previousStep = currentStep

  const sourceFileName = `./samples/shipment-use-case.${sessionScenarioName}.step-${currentStep}.json`;
  console.log(`[INFO] [${traceId}]   sourceFileName: ${sourceFileName}`);

  let source = {}
  try {
    source = jsonfile.readFileSync(sourceFileName) // MUST be changed to async
  } catch (err) {
    return res.status(404).json({
      error: {
        code: "ERR-06",
        message: `Cannot find the file \'${sourceFileName}\'.`
      }
    })
  }

  return res.status(200).send(source)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)

function handle(method, domain, path) {
  return {}
}