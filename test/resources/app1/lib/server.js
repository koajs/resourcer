var koa = require('koa');
var app = koa();
app.use(function*(){
  this.body = 'my nested server'
})
module.exports = app;
