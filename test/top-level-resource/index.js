
var koa = require('koa');
var app = koa();

app.use(function* () {
  this.body = 'top level'
});

module.exports = app
