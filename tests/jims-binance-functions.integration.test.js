'use strict';
/**
 *  @author Jim Lynch
 *
 */
const expect = require('chai').expect;
const JismBinanceFunctions = require('./../src/jims-binance-functions');


describe('Binance Functions', function () {

  describe('getPrice', () => {

    it('should get a price for Bitcoin to USD.', () => {
      console.log('getting price...');
      const jimsBinanceFunctions = new JismBinanceFunctions();



      jimsBinanceFunctions.getCandles('BNBBTC').then( result => {

        console.log('result', result );
        expect(result).to.not.equal(null);
        expect(isNaN(parseFloat(result))).to.be.false;
        expect(parseFloat(result)).to.be.greaterThan(0);


        });

    })

  });
});