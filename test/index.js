
var koa = require('koa');
var http = require('http');
var assert = require('assert');
var join = require('path').join;
var request = require('supertest');
var resource = require('../');

describe('koa-resourcer', function() {
  var app = koa();
  var mounted = 0;
  var path = join(__dirname, 'resources');

  var apps = {};

  resource(app, path, function(o) {
    apps[o.path] = o;
    ++mounted;
  })

  function test(app){
    return request(http.createServer(app.callback()))
  }

  describe('callback', function() {
    it('is optional', function(done) {
      resource(koa(), path);
      done();
    });

    it('executes for each mounted app', function(done) {
      assert.equal(3, mounted);
      done();
    });

    it('is passed the path and mounted resource', function(done) {
      assert(apps['/users']);
      assert(apps['/v1/app2']);
      assert(apps['/v1/different/fun']);
      done();
    });
  });

  it('ignores the parent directory in the mount paths', function(done) {
    test(app).get('/resource/users').expect(404, done);
  });

  it('honors config.json path property in dirs that have no app', function(done) {
    test(app).get('/v1/different/fun')
    .expect(200)
    .expect('fun.js', done);
  });

  it('honors config.json path property in dirs that have apps', function(done) {
    test(app).get('/users')
    .expect(200, done)
  });

  it('supports nested source paths', function(done) {
    test(app).get('/users')
    .expect('my nested server', done)
  });

  it('supports apps in the top level directory', function(done) {
    var path = join(__dirname, 'top-level-resource');

    resource(koa(), path, function(o) {
      assert.equal('/', o.path);
    });

    done();
  });
});
