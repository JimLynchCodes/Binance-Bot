module.exports = function (req, res) {

  const JimsBinanceFunctions = require('./src/jims-binance-functions');
  routes.jimsBinanceBot = new JimsBinanceFunctions();

  console.log('query is: ', req.query);
  console.log('process.env is: ', process.env);
  console.log('gateway is: ', req.apiGateway);

  routes.lambdaParams = {};

  if (req.apiGateway) {
    routes.lambdaParams = Object.assign({}, routes.lambdaParams, req.apiGateway.event)
  }

  if (req.query) {
    routes.lambdaParams = Object.assign({}, routes.lambdaParams, req.query)
  }

  res.set({
    'Content-Type': 'routeslication/json',
    'charset': 'utf-8'
  });

  return routes.jimsBinanceBot.getPrevDayData('BNBBTC').then(binanceData => {
    console.log('binance data is: ' + binanceData);
    res.send(binanceData);
  }, err => {
    res.send(err);
  });

}