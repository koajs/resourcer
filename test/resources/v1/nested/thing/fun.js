
var koa = require('koa');
var app = koa();

app.use(function* () {
  this.body = 'fun.js'
})

module.exports = app;
