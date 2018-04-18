'use strict';
/**
 *  @author Jim Lynch <jim@wisdomofjim.com
 *
 *  This file is an example of how you can extract asynchronous apis into class containing one or more functions that
 *  (could) return promises.
 */

const axios = require('axios');
const errorResponse = {'error': 'Please pass query parameter "character" with a value 0 - 10.'};
const creds = require('./../.creds');
const binance = require('node-binance-api');


class JimsBinanceFunctions {

  constructor(symbols) {

    binance.options({
      APIKEY: '<key>',
      APISECRET: '<secret>',
      useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
      test: true // If you want to use sandbox mode where orders are simulated
    });

    this.axios = axios;
  }

  /**
   *
   *  Pass in a number 1-10 representing a star wars character.
   *  return hair_color and eye color of that character.
   *
   *  @param number
   *  @returns {Promise}
   *
   *    @resolves {
   *      name: String
   *      hairColor: String,
   *      eyeColor: String,
   *    }
   *
   *    @rejects {
   *      msg: string
   *    }
   */

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
      binance.prices(ticker, (error, ticker) => {
        console.log("Price of crypto (" + tickerName + "): " + ticker[tickerName]);
        resolve(ticker[tickerName]);
      })
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