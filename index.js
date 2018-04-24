'use strict';
/**
 *  @author Jim Lynch
 *
 *  Entry point for lambda event.
 */

const awsServerlessExpress = require('aws-serverless-express')
const routes = require('./routes')
const server = awsServerlessExpress.createServer(routes)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
