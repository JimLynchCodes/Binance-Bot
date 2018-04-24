function readEnvVariables(req) {

  // console.log('query is: ', req.query);
  // console.log('process.env is: ', process.env);
  // console.log('gateway is: ', req.apiGateway);

  this.lambdaParams = {}

  if (req.apiGateway) {
    this.lambdaParams = Object.assign({}, this.lambdaParams, req.apiGateway.event)
  }

  if (req.query) {
    this.lambdaParams = Object.assign({}, this.lambdaParams, req.query)
  }

  return lambdaParams;
}


module.exports = function (req, res) {

  console.log('in the empty route!');

  const JimsBinanceFunctions = require('./../jims-binance-functions');
  this.jimsBinanceBot = new JimsBinanceFunctions();

  this.lambdaParams = readEnvVariables(req);

  res.set({
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  });

  res.format({

    'application/json': () => {
      return this.jimsBinanceBot.getRecommendation('BNBBTC').then(recommendation => {
        console.log('got recommendation');
        res.json(recommendation);
      });
      // res.send({message: 'hey'});
    }

  });


}


