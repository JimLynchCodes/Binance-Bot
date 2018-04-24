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


      binance.options({
        APIKEY: '<key>',
        APISECRET: '<secret>',
        useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
        test: true // If you want to use sandbox mode where orders are simulated
      });

  }

  hello() {

    console.log('saying hello')
    return new Promise((resolve, reject) => {

      console.log('credskey is ');

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

        resolve(ticks[98][0]);

    })
  };


  getPrevDayData(tickerName) {

    console.log('getting candles...')
    return new Promise((resolve, reject) => {


      // different stuff

      // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
      return binance.prevDay("BNBBTC", (error, ticks, symbol) => {
        console.log("prev day", error);
        console.log("prev day", symbol);
        console.log("prev day", ticks);
        let last_tick = ticks[ticks.length - 1];
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        console.log(symbol + " last close: " + close);


        console.log(ticks.length)

        ticks.forEach(tick => {

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
  }

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