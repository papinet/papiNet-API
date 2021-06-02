'use strict'
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const short = require('short-uuid')
const jsonfile = require('jsonfile')

/*
We will one specific TCP port per release with the following mapping:
3001 = 1.0.0
3002 = 1.1.0
*/
const PORT = 3002
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
    lastStep: 6,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.papinet.io",
    path: "/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4",
    useCase: "order-status-use-case",
    name: "B",
    firstStep: 1,
    lastStep: 8,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.papinet.io",
    path: "/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
    useCase: "order-status-use-case",
    name: "C",
    firstStep: 1,
    lastStep: 7,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.papinet.io",
    path: "/orders/fb441640-e40b-4d91-8930-61ebf981da63",
    useCase: "order-status-use-case",
    name: "D",
    firstStep: 1,
    lastStep: 9,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.papinet.io",
    path: "/orders/12e8667f-14ed-49e6-9610-dc58dee95560",
    useCase: "order-status-use-case",
    name: "E",
    firstStep: 1,
    lastStep: 7,
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
    firstStep: 3,
    lastStep: 7,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.fast.papinet.io",
    path: "/shipments",
    useCase: "shipment-use-case",
    name: "B",
    firstStep: 2,
    lastStep: 2,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.fast.papinet.io",
    path: "/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
    useCase: "shipment-use-case",
    name: "B",
    firstStep: 3,
    lastStep: 7,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.pulp.papinet.io",
    path: "/shipments",
    useCase: "shipment-use-case",
    name: "C",
    firstStep: 2,
    lastStep: 2,
    previousStep: 0
  },
  {
    method: "GET",
    domain:"papinet.pulp.papinet.io",
    path: "/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
    useCase: "shipment-use-case",
    name: "C",
    firstStep: 3,
    lastStep: 7,
    previousStep: 0
  }
]
const scenariosIndexedByAPIEndpoint = [
  "GET|papinet.papinet.io|/orders",
  "GET|papinet.papinet.io|/orders/c51d8903-01d1-485c-96ce-51a9be192207",
  "GET|papinet.papinet.io|/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "GET|papinet.papinet.io|/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "GET|papinet.papinet.io|/orders/fb441640-e40b-4d91-8930-61ebf981da63",
  "GET|papinet.papinet.io|/orders/12e8667f-14ed-49e6-9610-dc58dee95560",
  "GET|papinet.road.papinet.io|/shipments",
  "GET|papinet.road.papinet.io|/shipments/c51d8903-01d1-485c-96ce-51a9be192207",
  "GET|papinet.fast.papinet.io|/shipments",
  "GET|papinet.fast.papinet.io|/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
  "GET|papinet.pulp.papinet.io|/shipments",
  "GET|papinet.pulp.papinet.io|/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17"
]

// post /tokens
app.post('/tokens', (req, res) => {
  const traceId = short.uuid()
  console.log(`[INFO] [${traceId}] post /tokens [${Date.now()}] `)
  const id = short.uuid()
  const domain = req.hostname // Contains the hostname derived from the Host HTTP header.
  console.log(`[INFO] [${traceId}]   domain = ${domain} [${Date.now()}]`)

  //const scenarioPos = scenariosIndexedByParty.indexOf(party)
  //console.log(`[INFO] [${traceId}]   scenarioPos: ${scenarioPos}`)
  // This is the (ONLY) good way to make a genuine COPY!!!
  //const sessionScenario = JSON.parse(JSON.stringify(scenarios[scenarioPos]));
  //we do NOT know which scenario YET ???

  const session = {
    id: id,
    token: id,
    domain: domain,
    scenario: {}
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
  const traceId = short.uuid();
  console.log(`[INFO] [${traceId}] GET /orders [${Date.now()}]`)

  handle(traceId, 'GET', '/orders', req, res)

  return // END HERE!

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

// get /orders/{orderId}
app.get('/orders/:orderId', (req, res) => {
  const traceId = short.uuid();
  const orderId = req.params.orderId;
  console.log(`[INFO] [${traceId}] get /orders/${orderId} [${Date.now()}]`)

  handle(traceId, 'GET', `/orders/${orderId}`, req, res)

  return // END HERE!
})

// get /shipments
app.get('/shipments', (req, res) => {
  const traceId = short.uuid();
  console.log(`[INFO] [${traceId}] get /shipments [${Date.now()}]`)

  handle(traceId, 'GET', '/shipments', req, res)

  return // END HERE!

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

  handle(traceId, 'GET', `/shipments/${shipmentId}`, req, res)

  return // END HERE!

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

  const sessionDomain = sessions[sessionPos].domain
  console.log(`[INFO] [${traceId}]   sessionDomain: ${sessionDomain}`)

  const domain = req.header('X-papiNet-Domain')
  console.log(`[INFO] [${traceId}]   domain: ${domain}`)

  if (sessionDomain !== domain) {
    return res.status(401).json({
      error: {
        code: "ERR-06",
        message: "The 'X-papiNet-Domain' does not correpsond to the session's domain :("
      }
    })
  }

  const sessionScenario = sessions[sessionPos].scenario
  console.log(`[INFO] [${traceId}]   apiEndpoint: ${sessionScenario}`)

  if (JSON.stringify(sessionScenario) === '{}') {
    const apiEndpoint = `GET|${domain}|/shipments/${shipmentId}`
    console.log(`[INFO] [${traceId}]   apiEndpoint: ${apiEndpoint}`)

    const scenarioPos = scenariosIndexedByAPIEndpoint.indexOf(apiEndpoint)
    console.log(`[INFO] [${traceId}]   scenarioPos: ${scenarioPos}`)

    sessions[sessionPos].scenario = JSON.parse(JSON.stringify(scenarios[scenarioPos]))
    console.log(`[INFO] [${traceId}]   apiEndpoint: ${sessionScenario}`)
  }

  const sessionScenarioUseCase = sessions[sessionPos].scenario.useCase
  console.log(`[INFO] [${traceId}]   sessionScenarioUseCase: ${sessionScenarioUseCase}`)

  const sessionScenarioName = sessions[sessionPos].scenario.name
  console.log(`[INFO] [${traceId}]   sessionScenarioName: ${sessionScenarioName}`)

  /*
  {
    method: "GET",
    domain:"papinet.road.papinet.io",
    path: "/shipments",
    useCase: "shipment-use-case",
    name: "A",
    firstStep: 2,
    lastStep: 2,
    previousStep: 0
  }
  */

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

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)

/*
HANDLE
*/
function handle(traceId, method, path, req, res) {
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

  const sessionDomain = sessions[sessionPos].domain
  console.log(`[INFO] [${traceId}]   sessionDomain: ${sessionDomain}`)

  const domain = req.hostname // Contains the hostname derived from the Host HTTP header.
  console.log(`[INFO] [${traceId}]   domain: ${domain}`)

  if (sessionDomain !== domain) {
    return res.status(401).json({
      error: {
        code: "ERR-06",
        message: "The 'X-papiNet-Domain' does not correpsond to the session's domain :("
      }
    })
  }

  const apiEndpoint = `GET|${domain}|${path}`
  console.log(`[INFO] [${traceId}]   apiEndpoint: ${apiEndpoint}`)

  const scenarioPos = scenariosIndexedByAPIEndpoint.indexOf(apiEndpoint)
  console.log(`[INFO] [${traceId}]   scenarioPos: ${scenarioPos}`)

  const scenario = scenarios[scenarioPos]
  console.log(`[INFO] [${traceId}]   scenario: ${JSON.stringify(scenario)}`)

  const scenarioUseCase = scenario.useCase
  console.log(`[INFO] [${traceId}]   scenarioUseCase: ${scenarioUseCase}`)
  const scenarioName = scenario.name
  console.log(`[INFO] [${traceId}]   scenarioName: ${scenarioName}`)

  const sessionScenario = sessions[sessionPos].scenario
  console.log(`[INFO] [${traceId}]   sessionScenario: ${JSON.stringify(sessionScenario)}`)

  if (JSON.stringify(sessionScenario) === '{}') {
    sessions[sessionPos].scenario = JSON.parse(JSON.stringify(scenarios[scenarioPos]))
    console.log(`[INFO] [${traceId}]   apiEndpoint: ${sessionScenario}`)
  }

  const sessionScenarioUseCase = sessions[sessionPos].scenario.useCase
  console.log(`[INFO] [${traceId}]   sessionScenarioUseCase: ${sessionScenarioUseCase}`)

  const sessionScenarioName = sessions[sessionPos].scenario.name
  console.log(`[INFO] [${traceId}]   sessionScenarioName: ${sessionScenarioName}`)

  if (sessionScenarioUseCase == scenarioUseCase && (sessionScenarioName == scenarioName || sessionScenarioName == '_')) {
    if (sessionScenario.path != scenario.path) {
      console.log(`[INFO] [${traceId}]   UPDATE the session!`)
      sessions[sessionPos].scenario = JSON.parse(JSON.stringify(scenarios[scenarioPos]))
      console.log(`[INFO] [${traceId}]   sessionScenario: ${JSON.stringify(sessionScenario)}`)
    }
  } else {
    return res.status(401).json({
      error: {
        code: "ERR-07",
        message: "The scenario does not correpsond to the session's scenario :("
      }
    })
  }

  console.log(`[INFO] [${traceId}]   sessionScenarioUseCase: ${sessionScenarioUseCase}`)
  console.log(`[INFO] [${traceId}]   sessionScenarioName: ${sessionScenarioName}`)

  /*
  {
    method: "GET",
    domain:"papinet.road.papinet.io",
    path: "/shipments",
    useCase: "shipment-use-case",
    name: "A",
    firstStep: 2,
    lastStep: 2,
    previousStep: 0
  }
  */

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

  // WARNING: Using 'sessions[sessionPos].scenario.name' instead of 'sessionScenarioName'
  //          as it may have changed, this is UGLY CODE, but it works for now :-|
  const sourceFileName = `./samples/${sessionScenarioUseCase}.${sessions[sessionPos].scenario.name}.step-${currentStep}.json`;
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
}