'use strict'
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const short = require("short-uuid");
const jsonfile = require("jsonfile");

const PORT = 3001;
const HOST = '0.0.0.0';
const SERVICE_NAME = "papinet-mock";
const SERVICE_VERSION = "1.0.0";

const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

const corsOptions = {};
app.use(cors(corsOptions));

const sessions = [];
const sessionsIndexedByToken = [];

const ordersToCopy = [
  {
    id: "c51d8903-01d1-485c-96ce-51a9be192207",
    scenario: "A",
    currentStep: 0,
    numberOfSteps: 6
  },
  {
    id: "778fe5cb-f7ac-4493-b492-25fe98df67c4",
    scenario: "B",
    currentStep: 0,
    numberOfSteps: 8
  },
  {
    id: "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
    scenario: "C",
    currentStep: 0,
    numberOfSteps: 7
  },
  {
    id: "fb441640-e40b-4d91-8930-61ebf981da63",
    scenario: "D",
    currentStep: 0,
    numberOfSteps: 9
  },
  {
    id: "12e8667f-14ed-49e6-9610-dc58dee95560",
    scenario: "E",
    currentStep: 0,
    numberOfSteps: 6
  },
  {
    id:"1804bcfb-15ae-476a-bc8b-f31bc9f4de62",
    scenario: "F",
    currentStep: 0,
    numberOfSteps: 6
  }
];
const ordersIndexedById = [
  "c51d8903-01d1-485c-96ce-51a9be192207",
  "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "fb441640-e40b-4d91-8930-61ebf981da63",
  "12e8667f-14ed-49e6-9610-dc58dee95560",
  "1804bcfb-15ae-476a-bc8b-f31bc9f4de62"
];

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
        code: "ERR-01",
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
        code: "ERR-02",
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
        code: "ERR-03",
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

// post /tokens
app.post('/tokens', (req, res) => {
  const traceId = short.uuid();
  console.log(`[INFO] [${traceId}] post /tokens [${Date.now()}] `);
  const id = short.uuid();
  /*
  const orders = ordersToCopy; // Is this a COPY? No, it's NOT a COPY :-(
  let orders = ordersToCopy; // Is this a COPY? No, it's NOT a COPY :-(
  const orders = [...ordersToCopy]; // Is this a COPY? No, it's NOT a COPY :-(
  const orders = ordersToCopy.slice(); // Is this a COPY? No, it's NOT a COPY :-(
  const orders = Array.from(ordersToCopy);  // Is this a COPY? No, it's NOT a COPY :-(
  */
  const orders = JSON.parse(JSON.stringify(ordersToCopy)); // Is this a COPY? YEEEEEEEEES ;-)
  const session = {
    id: id,
    token: id,
    orders: orders
  };
  sessions.push(session);
  sessionsIndexedByToken.push(session.token);
  res.status(201).json({
    token: session.token
  });
});

// get /debug
app.get('/debug', (req, res) => {
  return res.status(200).send(sessions);
});

// get /orders/{orderId}
app.get('/orders/:orderId', (req, res) => {
  const traceId = short.uuid();
  console.log(`[INFO] [${traceId}] get /orders/{orderId} [${Date.now()}]`);
  const authorization = req.headers.authorization;
  console.log(`[INFO] [${traceId}]   authorization: ${authorization} [${Date.now()}]`);

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "ERR-04",
        message: "Cannot get a bearer token :-("
      }
    });
  }

  const token = authorization.substring(7, authorization.length);
  console.log(`[INFO] [${traceId}]   token: ${token}`);

  const sessionPos = sessionsIndexedByToken.indexOf(token);
  console.log(`[INFO] [${traceId}]   sessionPos: ${sessionPos}`);

  if (sessionPos === -1) {
    return res.status(401).json({
      error: {
        code: "ERR-05",
        message: "Cannot retrieve the session based on the Bearer token :-("
      }
    });
  }

  const orderId = req.params.orderId;
  console.log(`[INFO] [${traceId}]   orderId: ${orderId}`);
  const orderPos = ordersIndexedById.indexOf(orderId);
  console.log(`[INFO] [${traceId}]   orderPos: ${orderPos}`);

  if (orderPos === -1) {
    return res.status(404).end();
  }

  const scenario = sessions[sessionPos].orders[orderPos].scenario;
  console.log(`[INFO] [${traceId}]   scenario: ${scenario}`);

  const previousStep = sessions[sessionPos].orders[orderPos].currentStep;
  console.log(`[INFO] [${traceId}]   previousStep: ${previousStep}`);
  const numberOfSteps = sessions[sessionPos].orders[orderPos].numberOfSteps;
  console.log(`[INFO] [${traceId}]   numberOfSteps: ${numberOfSteps}`);

  let currentStep = previousStep;
  if (previousStep < numberOfSteps) {
    currentStep++;
    sessions[sessionPos].orders[orderPos].currentStep = currentStep;
  }
  console.log(`[INFO] [${traceId}]   currentStep: ${currentStep}`);

  const sourceFileName = `./order.${scenario}.step-${currentStep}.json`;
  console.log(`[INFO] [${traceId}]   sourceFileName: ${sourceFileName}`);

  let response = {};
  let source = {}
  try {
    source = jsonfile.readFileSync(sourceFileName) // MUST be changed to async
  } catch (err) {
    return res.status(404).json({
      error: {
        code: "ERR-06",
        message: `There is no order with the selected orderId = \'${orderId}\'.`
      }
    })
  }
  let offset = parseInt(req.query.offset) || 0
  console.log(`[INFO] [${traceId}]   offset: ${sourceFileName}`);
  let limit = parseInt(req.query.limit)   || 2 // I may have to add a limit (?)
  console.log(`[INFO] [${traceId}]   limit: ${limit}`);
  let end = offset + limit // Zero-based index **before** which to end extraction (not included).
  console.log(`[INFO] [${traceId}]   end: ${end}`);

  response = {
    id: source.id,
    orderNumber: source.orderNumber,
    orderStatus: source.orderStatus,
    numberOfLineItems: source.numberOfLineItems,
    orderLineItems: [],
    links: {}
  }

  let length = source.orderLineItems.length;
  console.log(`[INFO] [${traceId}]   length: ${length}`);

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
    /*
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
    */
    end = length; // That's simpler ;-)
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
