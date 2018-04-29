/**
 *  @author Jim Lynch <jim@wisdomofjim.com
 *
 *  This file is an example of how you can extract asynchronous apis into class containing one or more functions that
 *  (could) return promises.
 */

const axios = require('axios');
const errorResponse = {'error': 'Please pass query parameter "character" with a value 0 - 10.'};
const binance = require('node-binance-api');
const AWS = require('aws-sdk');

class JimsBinanceFunctions {

  constructor() {

    AWS.config.update({region: 'us-east-1'});

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


  /**
   *
   *   Remember, the candle endpoint returns the data that you would use to build a candlestick chart.
   *   ie. data for each minute on the minute of the hour (or less frequent if desired).
   *
   * @param tickerName
   * @param timeInterval
   * @returns {Promise}
   *
   *  Response:
   *
   *  [
   [
   1499040000000,      // Open time
   "0.01634790",       // Open
   "0.80000000",       // High
   "0.01575800",       // Low
   "0.01577100",       // Close
   "148976.11427815",  // Volume
   1499644799999,      // Close time
   "2434.19055334",    // Quote asset volume
   308,                // Number of trades
   "1756.87402397",    // Taker buy base asset volume
   "28.46694368",      // Taker buy quote asset volume
   "17928899.62484339" // Ignore
   ]
   ]
   *
   */
  // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
  getCandles(tickerName, timeInterval = "1m") {
    console.log('getting candles...')
    return new Promise((resolve, reject) => {
      return binance.candlesticks(tickerName, timeInterval, (error, ticks, symbol) => {
        // console.log("candlesticks()", ticks);
        return resolve(ticks)
      }, {limit: 3, endTime: (new Date()).getTime()});
    })
  };


  getPrevDayData(tickerName) {
    return new Promise((resolve, reject) => {
      return binance.prevDay(tickerName, (error, data) => {
        if (error) {
          return reject(error)
        }
        return resolve(data);
      });
    })
  }

  openCandleSocket() {
    binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
      let {e:eventType, E:eventTime, s:symbol, k:ticks} = candlesticks;
      let {o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume} = ticks;
    });
  }

  getRecommendation(ticker) {
    return Promise.all([
      this.getPrevDayData(ticker),
      this.getCandles(ticker, "1m"),
      this.getCandles(ticker, "5m")
    ]).then((values) => {

      let recommendationObj = {}
      recommendationObj['ticker'] = ticker;

      let prevDayData = values[0];
      let candles1Min = values[1];
      let candles5Min = values[2];

      recommendationObj.volume = {
        volumePastOneMinute: parseFloat(candles1Min[candles1Min.length - 2][5]),
        volumePastFiveMinute: parseFloat(candles5Min[candles5Min.length - 2][5]),
        volumePastOneDay: parseFloat(prevDayData.volume),
        normalizedVolumePastOneMinute: candles1Min[candles1Min.length - 2][5] / 1,
        normalizedVolumePastFiveMinute: candles5Min[candles5Min.length - 2][5] / 5,
        normalizedVolumePastOneDay: parseFloat(prevDayData.volume) / 24 / 60
      };

      console.log('doing  math')
      console.log('a ', recommendationObj.volume.normalizedVolumePastFiveMinute);
      console.log('b ', recommendationObj.volume.normalizedVolumePastOneDay);
      let g = recommendationObj.volume.normalizedVolumePastFiveMinute /
      recommendationObj.volume.normalizedVolumePastOneDay;
      console.log('c ', g);


      recommendationObj.price = {
        priceChangePast1min: candles1Min[candles1Min.length - 2][4] - candles1Min[candles1Min.length - 2][1],
        priceChangePast5min: candles5Min[candles5Min.length - 2][4] - candles5Min[candles5Min.length - 2][1],
        normalizedPriceChange1min: candles1Min[candles1Min.length - 2][4] - candles1Min[candles1Min.length - 2][1],
        normalizedPriceChange5min: (candles5Min[candles5Min.length - 2][4] - candles5Min[candles5Min.length - 2][1]) / 5,
        priceChange24hr: parseFloat(prevDayData.priceChange),
        highLowDiff24hr: prevDayData.highPrice - prevDayData.lowPrice,
        weightedAvgPrice24hr: parseFloat(prevDayData.weightedAvgPrice)
      };

      recommendationObj.recommendation = {
        toBuyOrNotToBuy: "Don\'t Buy",
        volumeHeatRating: "Hot",
        volumeRatio1minTo1day: recommendationObj.volume.normalizedVolumePastOneMinute /
        recommendationObj.volume.normalizedVolumePastOneDay,
        volumeRatio5minTo1day: recommendationObj.volume.normalizedVolumePastFiveMinute /
        recommendationObj.volume.normalizedVolumePastOneDay,
        volumeRatio1minTo5min: recommendationObj.volume.normalizedVolumePastOneMinute /
        recommendationObj.volume.normalizedVolumePastFiveMinute,
      };

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


module.exports = new JimsBinanceFunctions();
