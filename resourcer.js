
var fs = require('fs');
var assert = require('assert');
var join = require('path').join;
var mount = require('koa-mount');
var basename = require('path').basename;
var debug = require('debug')('koa-resourcer');

/**
 * Auto mount all child resources
 *
 * @param {koa app} app
 * @param {String} dir A directory name
 * @param {Function} [fn] callback to invoke for each mounted resource
 */

module.exports = function koaResourcer(app, dir, fn) {
  if (fn) {
    assert.equal('function', typeof fn, 'fn must be a Function');
  } else {
    fn = noop;
  }

  walk(dir);
  return;

  function walk(fulldirname, prefix) {
    var contents = fs.readdirSync(fulldirname);
    var config = getConfig(contents, fulldirname);

    if (config && config.source) {
      return handleApp(config, fulldirname, prefix);
    }

    if ('string' == typeof prefix) {
      if (config && config.path) {
        prefix = prefix + '/' + config.path;
      } else {
        prefix = prefix + '/' + basename(fulldirname);
      }
    } else {
      prefix = '';
    }

    contents.forEach(function(name) {
      var dir = join(fulldirname, name);
      var stat = fs.statSync(dir);
      if (!stat.isDirectory()) return;
      walk(dir, prefix);
    });
  }

  function getConfig(contents, dir) {
    if (~contents.indexOf('config.json')) {
      var path = join(dir, 'config.json');
      var config = require(path);

      if (config && config.path) {
        config.path = config.path.replace(/^\/+/, '');
      }

      return config;
    }
  }

  function handleApp(config, fulldirname, prefix) {
    assert(config.source, 'missing config.source');

    var source = join(fulldirname, config.source);
    debug('requiring source', source)
    var resource = require(source);

    var route = prefix + '/' + (config.path || basename(fulldirname));
    app.use(mount(route, resource));

    fn({ path: route, resource: resource });
  }
}

function noop() {};
