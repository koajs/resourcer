
var koa = require('koa');
var app = koa();

app.use(function* () {
  this.body = 'v1/app2/index.js'
});

module.exports = app
