const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const compression = require('compression')
const bodyParser = require('body-parser')
const express = require('express');
const app = express();

// app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(awsServerlessExpressMiddleware.eventContext())

const emptyRouteHandler = require('./src/routes/empty-route');

app.get('/', emptyRouteHandler);

app.post('/', function (req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

module.exports = app;
