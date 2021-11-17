'use strict'
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const short = require('short-uuid')

/*
We will one specific TCP port per release with the following mapping:
3001 = 1.0.0
3002 = 1.1.0
3003 = 1.2.0
*/
const PORT = 3003
const HOST = '0.0.0.0'
const SERVICE_NAME = 'papinet-mock'
const SERVICE_VERSION = '1.2.0'

const app = express()
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
// CORS
const corsOptions = {}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.status(200).json({
    message: `Hello from ${SERVICE_NAME} (${SERVICE_VERSION}) ;-)`
  })
})

const sessions = []
const sessionsIndexedByToken = []

// POST /tokens
app.post('/tokens', (req, res) => {
  const sessionId = short.uuid()
  console.log(`[INFO___][${sessionId}] POST /tokens [${Date.now()}]`)
  const domain = req.hostname // Contains the hostname derived from the Host HTTP header.
  console.log(`[INFO___][${sessionId}]   domain = req.hostname = "${domain}" [${Date.now()}]`)

  const session = {
    id: sessionId,
    token: sessionId,
    domain: domain,
    articles: []
  }

  sessions.push(session)
  sessionsIndexedByToken.push(session.token)
  res.status(201).json({
    access_token: session.token
  })
})

// retrieve sessionPos from bearer token:
function retrieveSessionPos(req, res, traceId) {
  console.log(`[INFO___][${traceId}]   BEGIN retrieveSessionPos [${Date.now()}]`)
  const authorization = req.headers.authorization
  console.log(`[INFO___][${traceId}]   authorization = req.headers.authorization = "${authorization}" [${Date.now()}]`)

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    console.log(`[ERROR__][${traceId}]   (401) Missing bearer token :-( [${Date.now()}]`)
    res.status(401).json({
      error: {
        code: "ERR-MISSING-BEARER-TOKEN",
        message: "Missing bearer token :-("
      }
    })
    console.log(`[INFO___][${traceId}]   RETURN retrieveSessionPos = -1 [${Date.now()}]`)
    return -1
  }

  const token = authorization.substring(7, authorization.length)
  console.log(`[INFO___][${traceId}]   token = "${token}"`)

  const sessionPos = sessionsIndexedByToken.indexOf(token)
  console.log(`[INFO___][${traceId}]   sessionPos= "${sessionPos}"`)

  if (sessionPos === -1) {
    console.log(`[ERROR__][${traceId}]   (401) Cannot retrieve the session based on the bearer token :-( [${Date.now()}]`)
    res.status(401).json({
      error: {
        code: "ERR-CANNOT-FIND-SESSION",
        message: "Cannot retrieve the session based on the bearer token :-("
      }
    })
    console.log(`[INFO___][${traceId}]   RETURN retrieveSessionPos = -1 [${Date.now()}]`)
    return -1
  }

  console.log(`[INFO___][${traceId}]   RETURN retrieveSessionPos = ${sessionPos} [${Date.now()}]`)
  return sessionPos
}

const products = require('./samples/catalogue-use-case.sappi.json')

// List all `seller-products`:
app.get('/seller-products', (req, res) => {
  handleCollections(req, res, products,
    ["numberOfSellerProducts", "products"],
    ["id", "otherIdentifier", "status", "name", "link", "descriptions", "productType"])
})

// Get the details of a specific `seller-product`:
app.get('/seller-products/:sellerProductId', (req, res) => {
  const result = products.filter(product => product.id === req.params.sellerProductId)
  if (result.length === 0) {
    res.status(204).end()
  } else if (result.length === 1) {
    res.status(200).json(result[0])
  } else {
    res.status(500).end()
  }
})

// Create a new `customer-article`:
app.post('/customer-articles', (req, res) => {
  const id = short.uuid()
  console.log(`[INFO___][${id}] POST /customer-articles [${Date.now()}]`)
  const sellerProductId = req.body.sellerProductId

  const sessionPos = retrieveSessionPos(req, res, id)
  if (sessionPos === -1) return

  // Check if the `seller-product` exists:
  if (products.filter(product => product.id === sellerProductId).length !== 1) {
    res.status(400).json({ "error": `The seller-product ${sellerProductId} does NOT exist :-(` } )
    return
  }
  const product = products.filter(product => product.id === sellerProductId)[0]
  const article = {
    id: id,
    otherIdentifier: req.body.otherIdentifier,
    sellerProductId: product.id,
    sellerProductOtherIdentifier: product.otherIdentifier,
    sellerProductStatus: product.status,
    status: req.body.status,
    name: req.body.name,
    link: `/customer-articles/${id}`,
    descriptions: req.body.descriptions,
    productType: req.body.productType,
    paper: {
      finishType: product.paper.finishType,
      printType: product.paper.printType,
      basisWeight: req.body.paper.basisWeight,
      width: req.body.paper.width,
      diameter: req.body.paper.diameter,
      coreDiameter: req.body.paper.coreDiameter
    }
  }
  sessions[sessionPos].articles.push(article);
  console.log(`[INFO] (internal) sessions[sessionPos].articles = ${JSON.stringify(sessions[sessionPos].articles)}`)
  res.location(`/customer-articles/${article.id}`)
  res.status(201).json(article);
});

// List all `customer-articles`:
app.get('/customer-articles', (req, res) => {
  const traceId = short.uuid()
  console.log(`[INFO___][${traceId}] GET /customer-articles [${Date.now()}]`)

  const sessionPos = retrieveSessionPos(req, res, traceId)
  if (sessionPos === -1) return

  handleCollections(req, res, sessions[sessionPos].articles,
    ["numberOfCustomerArticles", "customerArticles"],
    [
      "id",
      "otherIdentifier",
      "sellerProductId",
      "sellerProductOtherIdentifier",
      "sellerProductStatus",
      "status",
      "name",
      "link",
      "descriptions",
      "productType"
    ])
})

// Get the details of a specific `customer-article`:
app.get('/customer-articles/:customerArticleId', (req, res) => {
  const traceId = short.uuid()
  console.log(`[INFO___][${traceId}] GET /customer-articles [${Date.now()}]`)

  const sessionPos = retrieveSessionPos(req, res, traceId)
  if (sessionPos === -1) return

  const result = sessions[sessionPos].articles.filter(article => article.id === req.params.customerArticleId)
  if (result.length === 0) {
    res.status(404).end()
  } else if (result.length === 1) {
    res.status(200).json(result[0])
  } else {
    res.status(500).end()
  }
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)

function handleCollections(req, res, items, headers, properties) {
  if (items.length === 0) {
    res.status(204).end()
    return
  }
  // Validation of the `offset` and `limit` query parameters:
  let offset = req.query.offset
  let limit = req.query.limit
  if (offset === undefined) offset = 0
  if (limit === undefined) limit = 5
  // IMPORTANT: converstion to integers:
  offset = parseInt(offset)
  limit = parseInt(limit)
  if (isNaN(offset) || isNaN(limit)) {
    res.status(400).end()
    return
  }
  if (offset < 0 || limit <= 0) {
    res.status(400).end()
    return
  }
  // Create the result/output:
  const resultItems = []
  items.forEach((item, index, array) => {
    if (offset <= index && index < offset + limit) {
      const resultItem = {}
      properties.forEach((property) => {
        console.log(`[DEBUG__] property = ${property}; item[${property}] = ${item[property]}`)
        if (item[property] != undefined) {
          resultItem[property] = JSON.parse(JSON.stringify(item[property])) // DEEP COPY!
        } else {
          console.log(`[WARNING] The property ${property} was not present in`)
        }
      })
      resultItems.push(resultItem)
    }
  })
  res.status(200).json({
    [headers[0]]: items.length,
    [headers[1]]: resultItems,
    links: {
      self: {
        href: `${req.path}?offset=${offset}&limit=${limit}`
      },
      next: {
        href: `${req.path}?offset=${offset+limit}&limit=${limit}`
      }
    }
  })
}