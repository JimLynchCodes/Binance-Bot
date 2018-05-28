const jimsBinanceBot = require('./../jims-binance-functions');
const readEnvVariables = require('./../utils/readEnvVariables');


const respond = (res, data) => {
  // res.set({
  //   'Content-Type': 'application/json',
  //   'charset': 'utf-8'
  // });

  res.setHeader('Content-Type', 'text/plain');

  console.log(data.length)
  res.send(data)

  // console.log(typeof data)
  // console.log('stringed', JSON.stringify(data))
  // res.send({"hey": "that's weird"})

  // let array = [[{"hi":"hello"}], [{"hi":"hello"}], 'c']
  // res.send({
  //   "data": [
  //     {
  //       "ticker": "BNBBTC"
  //     }, {
  //       "ticker": "BNBUSDT",
  //     }
  //   ]
  // })
};

module.exports = function (req, res) {


  console.log(process);
  console.log(process.env);
  console.log('req.body');
  console.log(req.body);

  // console.log('req is', JSON.stringify(req));

  console.log('in the empty route!!!!');

  this.lambdaParams = readEnvVariables(req);

  console.log('lambdaParams tickers here: ' + this.lambdaParams.tickers);

  if (this.lambdaParams.tickers) {
    // let tickers = this.lambdaParams.tickers;

    let tickers = this.lambdaParams.tickers.split(',')

    // if (typeof tickers === 'string') {
    //   tickers = JSON.parse(this.lambdaParams.tickers);
    // }

    console.log('and it has length: ' + tickers)

    console.log('tickers now: ' + tickers);
    console.log('tickers now: ' + tickers.length);
    console.log('tickers now: ' + typeof tickers);


    console.log('getting recommendation...');

    // Promise.all here with each ticker is the url

    const tickerPromises = [];

    tickers.forEach(ticker => {

      console.log('getting recommendation for : ', ticker);
      tickerPromises.push(jimsBinanceBot.getRecommendation(ticker)
        // .then(recommendation => {
        // console.log('got recommendation');
        // respond(res, recommendation);
      // })
  );
    });

    Promise.all(tickerPromises).then( (result)=> {
      console.log('got result');
      console.log(result);

      function compare(a,b) {
        if (a.recommendation.volumeRatio1minTo1day > b.recommendation.volumeRatio1minTo1day)
          return -1;
        if (a.recommendation.volumeRatio1minTo1day < b.recommendation.volumeRatio1minTo1day)
          return 1;
        return 0;
      }

      const sorted = result.sort(compare);
      // const sorted = result;

      // var r = {data: []}

      // sorted.forEach( obj => {
      //   r.data.push(obj);
      // })

      console.log('object to return:');
      console.log(result);
      respond(res, JSON.stringify(sorted, null, 3))
    }, errors => {
      console.log('errors: ' + JSON.stringify(errors));
    })


  } else {
    respond(res, {"error": 'Please include a "tickers" querey parameter.'})
  }

  // Promise.all([ticker])
  //
  // jimsBinanceBot.getRecommendation('BNBBTC').then(recommendation => {
  //   console.log('got recommendation');
  //   res.json(recommendation);
  // });

  // in the .then combine into one big object and sort by (what user passes in? default ol ratio?)

}


