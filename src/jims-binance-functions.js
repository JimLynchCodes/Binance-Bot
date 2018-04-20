'use strict';
/**
 *  @author Jim Lynch <jim@wisdomofjim.com
 *
 *  This file is an example of how you can extract asynchronous apis into class containing one or more functions that
 *  (could) return promises.
 */

const axios = require('axios');
const errorResponse = {'error': 'Please pass query parameter "character" with a value 0 - 10.'};
// const creds = require('./../.creds');
const binance = require('node-binance-api');
// const AWS = require('aws-sdk');


class JimsBinanceFunctions {

  constructor(symbols) {



    const AWS = require('aws-sdk');
    AWS.config.update({region:'us-east-1'});
    // const encrypted = process.env['b_key'];
    let decrypted;


    // function processEvent(event, context, callback) {
    //   // TODO handle the event here
    // }

    // exports.handler = (event, context, callback) => {
    /**
      if (decrypted) {
        // processEvent(event, context, callback);
      } else {
        // Decrypt code should run once and variables stored outside of the function
        // handler so that these are decrypted once per container
        const kms = new AWS.KMS();
        kms.decrypt({ CiphertextBlob: new Buffer(encrypted, 'base64') }, (err, data) => {
          if (err) {
            console.log('Decrypt error:', err);
            // return callback(err);
            return;
          }
          decrypted = data.Plaintext.toString('ascii');
          console.log('decripted: ' + decrypted)
          // processEvent(event, context, callback);
        });
      }
     */
    // };

    // let decrypted;


    // function processEvent(event, context, callback) {
    //   // TODO handle the event here
    // }
    //
    //
    // // exports.handler = (event, context, callback) => {
    // if (decrypted) {
    //   processEvent(event, context, callback);
    // } else {
    //   // Decrypt code should run once and variables stored outside of the function
    //   const encrypted = process.env['b_key'];
    //
    //   AWS.config = new AWS.Config({
    //     region: 'us-east-1'
    //   });
    //
    //   console.log('encrypted is: ' + encrypted);
    //   // handler so that these are decrypted once per container
    //   const kms = new AWS.KMS();
    //   var params = {
    //     CiphertextBlob: new Buffer(encrypted, 'base64')// The encrypted data (ciphertext).
    //   };
    //
    //   kms.decrypt(params, function (err, data) {
    //     if (err) console.log(err); // an error occurred
    //     else     console.log(data);           // successful response
    //   });
      /*
       data = {
       KeyId: "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab", // The Amazon Resource Name (ARN) of the CMK that was used to decrypt the data.
       Plaintext: <Binary String>// The decrypted (plaintext) data.
       }

       kms.decrypt( new Buffer(encrypted, 'base64') , (err, data) => {
       if (err) {
       console.log('Decrypt error:', err);
       return callback(err);
       }
       decrypted = data.Plaintext.toString('ascii');
       processEvent(event, context, callback);

       console.log('got decrypted stuff!')
       });
       }
       // };


       this.axios = axios;
       }
       */

      binance.options({
        APIKEY: '<key>',
        APISECRET: '<secret>',
        useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
        test: true // If you want to use sandbox mode where orders are simulated
      });

  }

  hello() {
    return new Promise((resolve, reject) => {

      console.log('credskey is ' + creds.key);

      // const intNumber = parseInt(number);
      //
      // if (isNaN(intNumber)) {
      //   reject(errorResponse)
      // } else if (intNumber < 1 || intNumber > 10) {
      //   reject(errorResponse)
      // }
      //
      // this.axios.get('https://swapi.co/api/people/' + intNumber)
      //   .then(function (response) {
      //     const importantData = {
      //       'name': response.data.name,
      //       'hairColor': response.data.hair_color,
      //       'eyeColor': response.data.eye_color,
      //     };
      //     resolve(importantData);
      //   })
      //   .catch(function (error) {
      //     reject({'error': error});
      //   });


      // resolve({'some stuff': 'thingies'});

      resolve(this.getPrice('BNBBTC'));

    })
  }


  /**
   *
   * takes a ticker and returns a promise that resolves to the data around that ticker.
   *
   * @param ticker
   *
   * example of return value: { ETHBTC: '0.07003500' }
   */
  getPrice(tickerName) {
    return new Promise((resolve, reject) => {
      return binance.prices(tickerName, (error, ticker) => {
        console.log("Price of crypto (" + tickerName + "): " + ticker[tickerName]);
        resolve(ticker[tickerName]);
      })
    })
  };

  openCandleSocket() {

    binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
      let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
      let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
      console.log(symbol+" "+interval+" candlestick update");
      console.log("open: "+open);
      console.log("high: "+high);
      console.log("low: "+low);
      console.log("close: "+close);
      console.log("volume: "+volume);
      console.log("isFinal: "+isFinal);
    });
  }


  getCandles(tickerName) {

    console.log('getting candles...')
    return new Promise((resolve, reject) => {

      // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
      return binance.candlesticks("BNBBTC", "1m", (error, ticks, symbol) => {
        console.log("candlesticks()", ticks);
        let last_tick = ticks[ticks.length - 1];
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        console.log(symbol+" last close: "+close);


        console.log(ticks.length)

        ticks.forEach( tick => {

          let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;

          let d = new Date(time);
          console.log('open time is : ', d.toString());

        })

      }, {limit: 5, endTime: (new Date()).getTime()});
      // return binance.candlesticks('BNBBTC', "5m", (error, ticks, symbol) => {
        // console.log("Candles of candles: (" + tickerName + "): " + ticker[tickerName]);


        // console.log('got candles: ', ticks);
        // console.log('got candles: ', error);
        // console.log('got candles: ', symbol);
        // console.log('got candles: ', ticks[0][0]);


        resolve(ticks[98][0]);

      // })
    })
  };

  /**
   *
   * takes a ticker and returns a promise that resolves to the data around that ticker.
   *
   * @param ticker
   *
   * example of return value:
   *
   * {
      "symbol": "BNBBTC",
      "bidPrice": "4.00000000",
      "bidQty": "431.00000000",
      "askPrice": "4.00000200",
      "askQty": "9.00000000"
     }
   */
  getBidAskPrices(tickerName) {
    return new Promise((resolve, reject) => {
      binance.bookTickers(ticker, (error, ticker) => {
        console.log("Bid / Ask prices of crypto (" + tickerName + "): " + ticker[tickerName]);
        resolve(ticker[tickerName]);
      })
    })
  };


  // getMarketDepth(ticker)

  // placeLimitOrder(ticker)

  // placeStopLossOrder(ticker)

  // cancelOpenOrders(s)(ticker)

  // cancelOpenOrders(s)(ticker)

  // get24hrChangeDifference(ticker)

  // get "kline / candelstick" data(ticker)


}

module.exports = JimsBinanceFunctions;