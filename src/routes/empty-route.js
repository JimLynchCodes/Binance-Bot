const jimsBinanceBot = require('./../jims-binance-functions');
const readEnvVariables = require('./../utils/readEnvVariables');


module.exports = function (req, res) {

  console.log('in the empty route!');
  // console.log('JimsBinanceFunctions ', JimsBinanceFunctions);

  console.log('jimsBinanceBot', jimsBinanceBot);
  this.lambdaParams = readEnvVariables(req);
  console.log('lambdaParams', this.lambdaParams);

  res.set({
    'Content-Type': 'application/json',
    'charset': 'utf-8'
  });

  console.log('getting recommendation...');

  jimsBinanceBot.getRecommendation('BNBBTC').then(recommendation => {
    console.log('got recommendation');
    res.json(recommendation);
  });
  // res.send({message: 'hey'});


}


