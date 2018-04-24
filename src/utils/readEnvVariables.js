module.exports = function readEnvVariables(req) {

  this.lambdaParams = {}

  if (req.apiGateway) {
    this.lambdaParams = Object.assign({}, this.lambdaParams, req.apiGateway.event)
  }

  if (req.query) {
    this.lambdaParams = Object.assign({}, this.lambdaParams, req.query)
  }

  return lambdaParams;
}