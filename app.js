const express = require('express');
const app = express();
const JimsBinanceFunctions = require('./src/jims-binance-functions');
app.jimsBinanceBot = new JimsBinanceFunctions();

console.log('in app!');


app.getHandler = function (req, res) {

  console.log('in get handler');

  app.lambdaParams = {};

  if (req.apiGateway) {
    app.lambdaParams = Object.assign({}, app.lambdaParams, req.apiGateway.event)
  }


  console.log('gateway is: ', req.apiGateway);

  if (req.query) {
    app.lambdaParams = Object.assign({}, app.lambdaParams, req.query)
  }

  console.log('query is: ', req.query);

  res.set({
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  });

  return app.jimsBinanceBot.hello().then(binanceData => {

    console.log('b dat is: ' + binanceData);
    res.send(binanceData);
  }, err => {
    res.send(err);
  });


}

app.get('/', app.getHandler);

app.post('/', function (req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
