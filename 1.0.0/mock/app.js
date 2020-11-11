'use strict'
const express = require('express')
const jsonfile = require('jsonfile')
const PORT = 3001
const HOST = '0.0.0.0'
const app = express()

// get /orders
app.get('/orders', (req, res) => {
  let response = {};
  let sourceFileName = './orders.json'
  let source = {}
  try {
    source = jsonfile.readFileSync(sourceFileName) // MUST be changed to async
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "0f82451d-b3ac-4347-8386-16d2d361c255",
        message: "Cannot established connection to the database!"
      }
    })
  }

  let orderStatus = req.query.orderStatus || '*'
  let offset = parseInt(req.query.offset) || 0
  let limit = parseInt(req.query.limit)   || 2 // I may have to add a limit (?)
  let end = offset + limit // Zero-based index **before** which to end extraction (not included).

  // We apply the filter FIRST:
  let resultFiltered = source.filter(item => (orderStatus == '*' ? true : item.orderStatus == orderStatus))
  let length = resultFiltered.length

  if (length === 0) {
    return res.status(404).json({
      error: {
        code: "b5a54dab-7a01-4973-a47f-6be7134919b9",
        message: `There are no orders with the selected orderStatus = \'${orderStatus}\'.`
      },
      correction: {
        self: {
          href: `/orders`
        }
      }
    });
  }

  // Let's first verify that the (zero-based) offset is strictly less than the length, if NOT:
  if (offset >= length) {
    return res.status(400).json({
      error: {
        code: "3a34825f-64bc-4ed2-81b2-5e8bc33a59c9",
        message: `The (zero-based) offset = ${offset} is greather than or equal to the length = ${length}, obtained after filtering (orderStatus=\'${orderStatus}\').`
      },
      correction: {
        message: `You MUST provide an offset which is strictly less than the length = ${length}, obtained after filtering (orderStatus=\'${orderStatus}\').`,
        self: {
          href: `/orders?orderStatus=${orderStatus}&offset=${length-1}&limit=1`
        }
      }
    });
  }

  // Then, let's verify that the (zero-based not included) end is lower than or equal to the length, if NOT:
  if (end > length) {
    let correctedLimit = limit - (end - length) // see the example below
    return res.status(400).json({
      error: {
        code: "20cde508-e3d2-4379-8bd2-b39fd660a123",
        message: `The (zero-based not included) end = ${end}, which is calculated as the sum offset + limit = ${offset} + ${limit} = ${end}, is strictly greather than the length = ${length}, obtained after filtering (orderStatus=\'${orderStatus}\').`
      },
      correction: {
        message: `You MUST provide an offset = ${offset} and a limit = ${limit} for which the sum offset + limit = ${offset} + ${limit} = ${end} is lower than or equal to the length = ${length}, obtained after filtering (orderStatus=\'${orderStatus}\').`,
        self: {
          href: `/orders?orderStatus=${orderStatus}&offset=${offset}&limit=${correctedLimit}`
        }
      }
    });
  }

  let selfHref = `/orders?orderStatus=${orderStatus}&offset=${offset}&limit=${limit}`

  let resultFilteredAndSliced = resultFiltered.slice(offset, end)

  // If we can still continue with the same limit:
  let nextOffset = end
  let nextLimit = limit
  let nextEnd = nextOffset + nextLimit
  let nextHref = ''

  // But, let's check that the NEXT (zero-based) offset is strictly less than the length, if NOT:
  if (nextOffset >= length) {
    nextHref = ''
  } else {
    // However, let's also check that the NEXT (zero-based not included) end is lower than or equal to the length, if NOT:
    if (nextEnd > length) {
      // we have to adjut the limit:
      nextLimit = nextLimit - (nextEnd - length) // see the example below
    }
    nextHref = `/orders?orderStatus=${orderStatus}&offset=${nextOffset}&limit=${nextLimit}`
  }

  /*
         length = 5
1001 0 \ offset = 0 and limit = 2 => end = 2 | nextOffset = 2 and nextLimit = 2 => nextEnd = nextOffset + nextLimit = 4 < 5 = length
1002 1 / => OK
1003 2 \ offset = 2 and limit = 2 => end = 4 | nextOffset = 4 and nextLimit = 2 => nextEnd = nextOffset + nextLimit = 6 > 5 = length
1004 3 / nextLimit = nextLimit - (nextEnd - length) = 2 - (6 - 5) = 2 - 1 = 1
1005 4 \ offset = 4
  */  

  res.status(200).send({
    numberOfOrders: length,
    orders: resultFilteredAndSliced,
    links: {
      self: {
        href: selfHref
      },
      next: {
        href: nextHref
      }
    }
  })

})

// get /orders/{orderId}
app.get('/orders/:orderId', (req, res) => {
  let response = {};
  let orderId = req.params.orderId
  let sourceFileName = `./order.${orderId}.json`
  let source = {}
  try {
    source = jsonfile.readFileSync(sourceFileName) // MUST be changed to async
  } catch (err) {
    return res.status(404).json({
      error: {
        code: "dc6fd15d-d698-4e1a-bd16-3acd3fcb5426",
        message: `There is no order with the selected orderId = \'${orderId}\'.`
      }
    })
  }
  let offset = parseInt(req.query.offset) || 0
  let limit = parseInt(req.query.limit)   || 2 // I may have to add a limit (?)
  let end = offset + limit // Zero-based index **before** which to end extraction (not included).

  response = {
    id: source.id,
    orderNumber: source.orderNumber,
    orderStatus: source.orderStatus,
    numberOfLineItems: source.numberOfLineItems,
    orderLineItems: [],
    links: {}
  }

  let length = source.orderLineItems.length

  // Let's first verify that the (zero-based) offset is strictly less than the length, if NOT:
  if (offset >= length) {
    return res.status(400).json({
      error: {
        code: "d63d6ed0-132e-41b7-aedb-00c6213ee5b6",
        message: `The (zero-based) offset = ${offset} is greather than or equal to the length = ${length}.`
      },
      correction: {
        message: `You MUST provide an offset which is strictly less than the length = ${length}.`,
        self: {
          href: `/orders/${orderId}?offset=${length-1}&limit=1`
        }
      }
    });
  }

  // Then, let's verify that the (zero-based not included) end is lower than or equal to the length, if NOT:
  if (end > length) {
    let correctedLimit = limit - (end - length) // see the example above
    return res.status(400).json({
      error: {
        code: "81113d1d-957e-4628-be51-452fc9aaaa9c",
        message: `The (zero-based not included) end = ${end}, which is calculated as the sum offset + limit = ${offset} + ${limit} = ${end}, is strictly greather than the length = ${length}.`
      },
      correction: {
        message: `You MUST provide an offset = ${offset} and a limit = ${limit} for which the sum offset + limit = ${offset} + ${limit} = ${end} is lower than or equal to the length = ${length}.`,
        self: {
          href: `/orders/${orderId}?offset=${offset}&limit=${correctedLimit}`
        }
      }
    });
  }

  let selfHref = `/orders/${orderId}?offset=${offset}&limit=${limit}`

  let orderLineItemsSliced = source.orderLineItems.slice(offset, end)

  response.orderLineItems = orderLineItemsSliced;

  // If we can still continue with the same limit:
  let nextOffset = end
  let nextLimit = limit
  let nextEnd = nextOffset + nextLimit
  let nextHref = ''

  // But, let's check that the NEXT (zero-based) offset is strictly less than the length, if NOT:
  if (nextOffset >= length) {
    nextHref = ''
  } else {
    // However, let's also check that the NEXT (zero-based not included) end is lower than or equal to the length, if NOT:
    if (nextEnd > length) {
      // we have to adjut the limit:
      nextLimit = nextLimit - (nextEnd - length) // see the example below
    }
    nextHref = `/orders/${orderId}?offset=${nextOffset}&limit=${nextLimit}`
  }

  response.links = {
    self: { 
      href: selfHref
    },
    next: {
      href: nextHref
    }
  }

  res.status(200).send(response);
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
