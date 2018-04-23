define(['exports', 'aws-serverless-express', './app'], function (exports, awsServerlessExpress, app) {
  'use strict';
  /**
   *  @author Jim Lynch
   *
   *  Entry point for lambda event.
   */

  const server = awsServerlessExpress.createServer(app);

  exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
});