module.exports = function readEnvVariables(req) {

  this.lambdaParams = {}

  if (req.apiGateway) {
    console.log('apiGateway:', req.apiGateway);
    this.lambdaParams = Object.assign({}, this.lambdaParams, req.apiGateway.event)
  }

  if (req.query) {
    console.log('query:', req.query);
    this.lambdaParams = Object.assign({}, this.lambdaParams, req.query)
  }

  console.log('lambs');
  console.log(this.lambdaParams);
  return this.lambdaParams;
}