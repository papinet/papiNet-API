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

const products = require('./samples/sappi.products.json')

// List all `products`:
app.get('/products', (req, res) => {
  handleCollections(req, res, products, ["id", "name", "link"])
})

// Get the details of a specific `product`:
app.get('/products/:productId', (req, res) => {
  const result = products.filter(product => product.id === req.params.productId)
  if (result.length === 0) {
    res.status(404).end()
  } else if (result.length === 1) {
    res.status(200).json(result[0])
  } else {
    res.status(500).end()
  }
})

const articles = []

// Create a new `article`:
app.post('/articles', (req, res) => {
  const id = short.uuid()
  const productHref = req.body.productHref
  // Check if productHref exists:
  if (products.filter(product => product.id === productHref).length !== 1) {
    res.status(400).json({ "error": "productHref does NOT exist :-("} )
    return
  }
  const name = req.body.name
  const product = products.filter(product => product.id === productHref)[0]
  const article = {
    id: id,
    productHref: productHref,
    name: name,
    descriptions: product.descriptions,
    paper: {
      finishType: product.paper.finishType,
      printType: product.paper.printType,
      basisWeight: req.body.paper.basisWeight,
      reel: {
        width: req.body.paper.reel.width,
        diameter: req.body.paper.reel.diameter,
        coreDiameter: req.body.paper.reel.coreDiameter
      }
    }
  }
  articles.push(article);
  res.location(`/articles/${article.id}`)
  res.status(201).json(article);
});

// List all `articles`:
app.get('/articles', (req, res) => {
  handleCollections(req, res, articles, ["id", "productHref", "name"])
})

// Get the details of a specific `article`:
app.get('/articles/:articleId', (req, res) => {
  const result = articles.filter(article => article.id === req.params.articleId)
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

function handleCollections(req, res, items, properties) {
  if (items.length === 0) {
    res.status(404).end()
    return
  }
  // Validation of the `offset` and `limit` query parameters:
  let offset = req.query.offset
  let limit = req.query.limit
  if (offset === undefined) offset = 0
  if (limit === undefined) limit = 5
  // IMPORTANT!!!
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
        resultItem[property] = JSON.parse(JSON.stringify(item[property])) // DEEP COPY!
      })
      resultItems.push(resultItem)
    }
  })
  res.status(200).json({
    size: items.length,
    data: resultItems,
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