'use strict';

const supertest = require('supertest'); 
const test = require('unit.js');
const emptyRouteHandler = require('../src/routes/empty-route.js');

const request = supertest(emptyRouteHandler);

describe('Tests app', function() {
  it('verifies get', function(done) {
    // request.get('/').expect(200).end(function(err, result) {
    //
    //   console.log('err ', err);
    //   console.log('result ', result.body);
        // test.string(result).contains('Hello');
        // test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        // done(err);
    // });
    done();
  });
  it('verifies post', function(done) {
    // request.post('/').expect(200).end(function(err, result) {
    //     test.string(result.body.Output).contains('Hello');
    //     test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
    //     done(err);
    // });
    done();
  });
});

