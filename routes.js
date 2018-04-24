const emptyRouteHandler = require('./src/routes/empty-route');
const express = require('express');
const routes = express();

routes.get('/', emptyRouteHandler);

module.exports = routes;
