'use strict';
/**
 *  @author Jim Lynch
 *
 */
const expect = require('chai').expect;
const JismBinanceFunctions = require('./../src/jims-binance-functions');


describe('Binance Functions', function () {

  describe('getPrice', () => {

    xit('should get a price for Bitcoin to USD.', () => {
      const jimsBinanceFunctions = new JismBinanceFunctions();
      jimsBinanceFunctions.getCandles('BNBBTC').then(result => {
        expect(result).to.not.equal(null);
        expect(isNaN(parseFloat(result))).to.be.false;
        expect(parseFloat(result)).to.be.greaterThan(0);
      });
    })

      it('should get prev day data for Bitcoin to USD.', (done) => {

        const jimsBinanceFunctions = new JismBinanceFunctions();
        jimsBinanceFunctions.getPrevDayData('BNBBTC').then(result => {

          console.log('it resolved!');

          expect(result).to.not.equal(null);


          done();

        });

    }).timeout(4000);

  });
})