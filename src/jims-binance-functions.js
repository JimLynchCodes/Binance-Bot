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
    AWS.config.update({region: 'us-east-1'});
    // const encrypted = process.env['b_key'];
    let decrypted;


    binance.options({
      APIKEY: '<key>',
      APISECRET: '<secret>',
      useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
      test: true // If you want to use sandbox mode where orders are simulated
    });

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
        return resolve(ticker[tickerName]);
      })
    })
  };


  // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
  getCandles(tickerName, timeInterval = "1m") {
    console.log('getting candles...')
    return new Promise((resolve, reject) => {
      return binance.candlesticks(tickerName, timeInterval, (error, ticks, symbol) => {
        console.log("candlesticks()", ticks);
        return resolve(ticks)
        // let last_tick = ticks[ticks.length - 1];
        // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        // console.log(symbol + " last close: " + close);


        // console.log(ticks.length)

        // ticks.forEach(tick => {

          // let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;

          // let d = new Date(time);
          // console.log('open time is : ', d.toString());
        //
        // })

      }, {limit: 50, endTime: (new Date()).getTime()});
    })
  };


  getPrevDayData(tickerName) {
    return new Promise((resolve, reject) => {
      return binance.prevDay(tickerName, (error, data) => {
        if (error) {
          return resolve(error)
        }
        return resolve(data);
      });
    })
  }

  openCandleSocket() {
    binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
      let {e:eventType, E:eventTime, s:symbol, k:ticks} = candlesticks;
      let {o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume} = ticks;
      console.log(symbol + " " + interval + " candlestick update");
      console.log("open: " + open);
      console.log("high: " + high);
      console.log("low: " + low);
      console.log("close: " + close);
      console.log("volume: " + volume);
      console.log("isFinal: " + isFinal);
    });
  }


  getWeightedAvgVolFromCandles(candles) {
    return 42;
  }

  getPriceChangeFromCandles(candles) {
    return 42;
  }

  getRecommendation(ticker) {
    return Promise.all([
      jimsBinanceBot.getPrevDayData(ticker),
      jimsBinanceBot.getCandles(ticker, "1m"),
      jimsBinanceBot.getCandles(ticker, "5m")
    ]).then(function (values) {


      let prevDayData = values[0];
      let candles1Min = values[1];
      let candles5Min = values[2];

      console.log(prevDayData);
      console.log('oh yeah');


      let recommendationObj= { }

      recommendationObj['ticker'] = ticker;

      let volPast1Min = this.getWeightedAvgVolFromCandles(candles1Min);
      let volPast5Min = this.getWeightedAvgVolFromCandles(candles5Min);
      let priceChangePast1Min = this.getPriceChangeFromCandles(candles1Min);
      let priceChangePast5Min = this.getPriceChangeFromCandles(candles5Min);

      recommendationObj.volume = {
        volumePastOneMinute: volPast1Min,
        volumePastFiveMinute: volPast5Min,
        volumePastOneday: prevDayData.volume,
        normalizedVolumePastOneMinute: volPast1Min,
        normalizedVolumePastFiveMinute: volPast5Min / 5,
        normalizedVolumePastOneday: prevDayData.volume / 24 / 60
      };

      recommendationObj.price = {
        priceChangePastOneMinute: priceChangePast1Min,
        priceChangePastFiveMinute: priceChangePast5Min,
        normalizedPriceChangePastOneMinute: priceChangePast1Min,
        normalizedPriceChangePastFiveMinute: priceChangePast5Min / 5,
        weightedAvgPrice24hr: prevDayData.weightedAvgPrice
      };


      recommendationObj.reccomendation = {
        toBuyOrNotToBuy: "Don\'t Buy",
        volumeHeatRating: "Hot",
        volumeRatio1minTo1day: recommendationObj.volume.normalizedVolumePastOneMinute /
                               recommendationObj.volume.normalizedVolumePastOneDay,
        volumeRatio5minTo1day: recommendationObj.volume.normalizedVolumePastFiveMinute /
                               recommendationObj.volume.normalizedVolumePastOneDay,
        volumeRatio1minTo5min: recommendationObj.volume.normalizedVolumePastOneMinute /
                               recommendationObj.volume.normalizedVolumePastFiveMinute,
      }


      return recommendationObj;
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