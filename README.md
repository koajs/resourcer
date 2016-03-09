
# resourcer

A simple resource directory mounter for [koa](http://koajs.com).

[![Build Status](https://travis-ci.org/koajs/resourcer.svg?branch=master)](https://travis-ci.org/koajs/resourcer)
[![Coverage Status](https://img.shields.io/coveralls/koajs/resourcer.svg)](https://coveralls.io/r/koajs/resourcer)
[![npm](http://img.shields.io/npm/v/koa-resourcer.svg)](https://www.npmjs.org/package/koa-resourcer)

```js
var koa = require('koa');
var resource = require('koa-resourcer');

var app = koa();
resource(app, join(__dirname, 'resources') [, callback])
app.listen();
```

The idea behind `koa-resourcer` is complete modularity within your
koa app. Each directory can be a stand-alone koa application with all
it's own tests, docs, dependencies, etc. `koa-resourcer` makes it easy to
mount these apps if you follow a simple directory pattern.

- [directory structure](#directory-structure)
- [config.json](#configjson)
- [callbacks](#callbacks)
- [installation](#installation)
- [development](#development)
- [sponsored by](#sponsored-by)
- [license](#license)

### Directory structure

Say we have the following directory structure:

```
resources/
|-- v1/users/
|   |-- config.json
|   `-- app.js
|-- v1/products/
|   |-- config.json
|   |-- makefile
|   |-- index.js
|   |-- lib/
|   |   `-- utils.js
|   `-- test/
|       `-- index.js
`-- v2/users/
    |-- config.json
    `-- fun.js
```

We have three independent apps here. `v1/users/app.js`, `v1/products/index.js` and
`v2/users/fun.js`. We could use `koa-mount` directly and be done with it but
that requires the parent application to know where all the apps are and the paths
on which they should be mounted.

```js
var koa = require('koa')
var mount = require('koa-mount')
var app = koa()

var v1users = require('./v1/users/app.js')
app.use(mount('v1/users/', v1users))

var v2users = require('./v2/users/fun.js')
app.use(mount('v2/users/', v2users))

var v1products = require('./v1/products/')
app.use(mount('v1/products/', v1products))

// and so on, and so on, for each of your sub apps....

app.listen()
```

With `koa-resourcer` you let your directory structure and some simple
config files do the talking for you, keeping your parent application
peacefully oblivious.

```js
var koa = require('koa')
var join = require('path').join
var resource = require('koa-resourcer')
var app = koa()

resource(app, join(__dirname, 'resources'))

app.listen()
```

#### config.json

Each application directory must contain a `config.json` file. The `config.json` file
is used to discover the location of the application source code. This information
is stored in it's `source` property.

```js
// resources/v1/users/config.json

{ "source": "app.js" }
```

By relying on the directory structure to determine route paths, `koa-resourcer`
will automatically mount `app.js` on `/v1/users/` for you. If this path isn't
quite what you want, `koa-resourcer` also supports configuring your path names in
the `config.json` files.

```js
// resources/v1/users/config.json

{ "source": "app.js", "path": "user" }
```

By adding the `path` property to our configuration, `koa-resourcer` will now mount
the app on `/v1/user/`.


### Callbacks

If you pass a callback function as the third argument to `koa-resourcer`, it
will be executed for each mounted application passing an object containing
the path and application resource.

```js
var koa = require('koa')
var join = require('path').join
var resource = require('koa-resourcer')
var app = koa()

resource(app, join(__dirname, 'resources'), function(o){
  console.log('mounted %s', o.path, o.resource)
})

app.listen()
```

### Installation

```
npm install koa-resourcer --save
```

### Development

#### running tests

- `make test` runs tests
- `make test-cov` runs tests + test coverage
- `make open-cov` opens test coverage results in your browser

#### verbose logging

`koa-resourcer` supports the `debug` module for help during development.
Enable verbose logging by setting your `DEBUG` env variable like so:

````
DEBUG=koa-resourcer* npm test
```

## Sponsored by

[Pebble Technology!](https://www.pebble.com)

## License

[MIT](https://github.com/koajs/resourcer/blob/master/LICENSE)
