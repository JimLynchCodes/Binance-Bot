const express = require('express');
const routes = express();

const emptyRouteHandler = require('./src/routes/empty-route');

routes.get('/', emptyRouteHandler);

routes.post('/', function (req, res) {
  res.send({
    "Output": "Hello World!"
  });
});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = routes;
