const jimsBinanceBot = require('./../jims-binance-functions');
const readEnvVariables = require('./../utils/readEnvVariables');


module.exports = function (req, res) {

  console.log(req);
  console.log('req is', JSON.stringify(req));

  console.log('in the empty route!!!!');

  this.lambdaParams = readEnvVariables(req);

  console.log('lambdaParams tickers eere: ' + this.lambdaParams.tickers);

  if (this.lambdaParams.tickers) {
    console.log('and it has length: ' + this.lambdaParams.tickers.length)
  }

  res.set({
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  });

  console.log('getting recommendation...');

  jimsBinanceBot.getRecommendation('BNBBTC').then(recommendation => {
    console.log('got recommendation');
    res.json(recommendation);
  });

}


