'use strict';
/**
 *  @author Jim Lynch
 *
 *  Entry point for lambda event.
 */

const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const server = awsServerlessExpress.createServer(app)

console.log('startin up!');

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
