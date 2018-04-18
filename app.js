const express = require('express');
const app = express();
const JimsBinanceFunctions = require('./src/jims-binance-functions');
app.jimsBinanceBot = new JimsBinanceFunctions();

app.get('/', app.getHandler);


app.getHandler = function (req, res) {

  app.lambdaParams = {};

  if (req.apiGateway) {
    app.lambdaParams = Object.assign({}, app.lambdaParams, req.apiGateway.event)
  }

  if (req.query) {
    app.lambdaParams = Object.assign({}, app.lambdaParams, req.query)
  }

  res.set({
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  });

  return app.jimsBinanceBot.hello().then(binanceData => {
    res.send(binanceData);
  }, err => {
    res.send(err);
  });


}


app.post('/', function (req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
