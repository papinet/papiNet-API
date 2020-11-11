'use strict'
const source = require('./orders.json') // I am not sure this is the best way to load a JSON file...
const express = require('express')
const PORT = 3000
const HOST = '0.0.0.0'
const app = express()

// get /orders
app.get('/orders', (req, res) => {
  let response = {};
  let orderStatus = req.query.orderStatus || '*'
  let offset = parseInt(req.query.offset) || 0
  let limit = parseInt(req.query.limit)   || 2 // I may have to add a limit (?)
  let end = offset + limit // Zero-based index **before** which to end extraction (not included).

  // We apply the filter FIRST:
  let resultFiltered = source.filter(item => (orderStatus == '*' ? true : item.orderStatus == orderStatus))
  let length = resultFiltered.length

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

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
