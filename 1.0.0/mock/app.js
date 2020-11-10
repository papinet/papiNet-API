'use strict'
const input = require('./orders.json')
const express = require('express')
const PORT = 3000
const HOST = '0.0.0.0'
const app = express()

app.get('/orders', (req, res) => {
  let orderStatus = req.query.orderStatus || '*'
  let offset = parseInt(req.query.offset) || 0
  let limit = parseInt(req.query.limit)   || 2
  let end = offset + limit

  let resultFiltered = input.filter(item => (orderStatus === '*' ? true : item.orderStatus == orderStatus))
  let length = resultFiltered.length
  let resultFilteredAndSliced = resultFiltered.slice(offset, end)

  /*
         length = 5
1001 0 \ offset = 0
1002 1 / end    = 0 + 2 = 2 < 5 = length | end + limit = 2 + 2 = 4 < 5 = length
1003 2 \ offset = 2
1004 3 / end    = 2 + 2 = 4 < 5 = length | end + limit = 4 + 2 = 6 > 5 = length => limit = limit - (end + limit - length)
1005 4 \ offset = 4
  */  

  if (end < length) {
    res.send({
      orders: resultFilteredAndSliced,
      links: {
        next: {
          href: `/orders?orderStatus=${orderStatus}&offset=${end}&limit=${(end + limit < length ? limit : limit - (end + limit - length))}`
        }
      }
    })
  } else {
    res.send({
      orders: resultFilteredAndSliced,
      links: {}
    })
  }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
