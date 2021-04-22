'use strict'
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const short = require("short-uuid");
const jsonfile = require("jsonfile");

const PORT = 3001;
const HOST = '0.0.0.0';
const SERVICE_NAME = "papinet-mock";
const SERVICE_VERSION = "1.1.0";

const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());

const corsOptions = {};
app.use(cors(corsOptions));

// get /shipments
app.get('/shipments', (req, res) => {
  res.status(200).send({
    message: "Hello World!"
  })
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
