'use strict';
/**
 *  @author Jim Lynch
 *
 */
const expect = require('chai').expect;
const jimsBinanceFunctions = require('./../src/jims-binance-functions');


describe('Binance Functions', function () {

  describe('getPrice', () => {

    xit('should get a price for Binance Bucks to Bitcoin.', () => {
      // const jimsBinanceFunctions = new JimsBinanceFunctions();
      jimsBinanceFunctions.getCandles('BNBBTC').then(result => {
        expect(result).to.not.equal(null);
        expect(isNaN(parseFloat(result))).to.be.false;
        expect(parseFloat(result)).to.be.greaterThan(0);
      });
    })

    xit('should get prev day data for Binance Bucks to Bitcoin.', (done) => {

      // const jimsBinanceFunctions = new JimsBinanceFunctions();
      jimsBinanceFunctions.getPrevDayData('BNBBTC').then(result => {

        expect(result).to.not.equal(null);

        done();

      });

    }).timeout(4000);

    it('should get get a recommendation object for Binance Bucks to Bitcoin.', (done) => {

      // const jimsBinanceFunctions = new JimsBinanceFunctions();
      jimsBinanceFunctions.getRecommendation('BNBBTC').then(result => {

        console.log('got a recommendation!');

        expect(result).to.not.equal(null);


        done();

      });

    }).timeout(4000);

  });
})