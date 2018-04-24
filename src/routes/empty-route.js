const jimsBinanceBot = require('./../jims-binance-functions');
const readEnvVariables = require('./../utils/readEnvVariables');


module.exports = function (req, res) {
  console.log('in the empty route!');

  this.lambdaParams = readEnvVariables(req);

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


