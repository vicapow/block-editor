var path = require('path')
var fs = require('fs')
var browserify = require('browserify')
var watchify = require('watchify')
var through = require('through')
var concat = require('concat-stream')
var mkdirp = require('mkdirp')
var xtend = require('xtend')
var babelify = require('babelify')
var config = require('./config')

var commonSharedModules = [
  {name: 'd3'},
  {name: 'react'},
  // Example of a local alias:
  // {name: 'color', alias: './client/scripts/src/color'},
]

module.exports = function(app) {
  setupCommonBundleAndRoute(app)
  setupMainBundleAndRoute(app)
}

function setupCommonBundleAndRoute(app) {
  var relative = '/_build/js/common.js'
  var output = path.join(__dirname, config.staticOutputDir, relative)
  mkdirp(path.dirname(output), function(err, res) {
    if(err) throw err
    fs.unlink(output, function(err) {
      // We don't care if the file doesn't already exist.
      generateCommonBundle(relative, output, app)
    })
  })
}

function generateCommonBundle(relative, output, app) {
  var bundle = browserify({
    debug: config.debugBrowserify,
    minify: config.minify,
  })
  commonSharedModules.forEach(function(module) {
    if (!module.alias) bundle.require(module.name)
    else bundle.require(module.alias, {expose: module.name})
  })

  if (config.minify) bundle.transform({global: true}, 'uglifyify')

  var bundleError
  var chunks = []
  var finalBuffer

  bundle = bundle.bundle()
    .on('error', function(err) {
      console.error('bundle.on error common')
      bundleError = err
      throw err
      this.emit('end')
    })

  var bundleContent
  var requestQueue = []

  bundle.pipe(fs.createWriteStream(output))
  bundle.pipe(concat({encoding: 'string'}, function(content) {
    bundleContent = content
    requestQueue.forEach(function(item) { item.res.send(bundleContent) })
    requestQueue = []
  }))

  app.get(relative, function(req, res, next) {
    res.type('.js')
    if (bundleContent) return res.send(bundleContent)
    requestQueue.push({req: req, res: res, next: next})
  })
}

function setupMainBundleAndRoute(app) {
  var relative = '/_build/js/main.js'
  var output = path.join(__dirname, config.staticOutputDir, relative)
  mkdirp(path.dirname(output), function(err, res) {
    if(err) throw err
    fs.unlink(output, function(err) {
      generateMainBundleAndSetupRoute(relative, output, app)
    })
  })
}

function generateMainBundleAndSetupRoute(relative, output, app) {
  var browserifyArgs = {
    debug: config.debugBrowserify,
    minify: config.minify,
  }
  if (config.watchify) {
    bundle = watchify(browserify(xtend(watchify.args, browserifyArgs)), {
      delay: 0,
    })
  } else {
    bundle = browserify(browserifyArgs)
  }
  commonSharedModules.forEach(function(module) { bundle.external(module.name) })

  // React + ES6ify.
  bundle.transform(babelify.configure({
    optional: ['runtime', 'es7.objectRestSpread'],
  }))
  if (browserifyArgs.minify) bundle.transform({global: true}, 'uglifyify')

  var entryPoint = path.join(__dirname, './src/main.js')
  bundle.require(entryPoint, {entry: true})

  var bundleContent
  var bundleError
  var requestQueue = []
  function build() {
    bundleContent = undefined
    var buildBundle = bundle.bundle()
    buildBundle.on('error', function(err) {
      console.error(err.message)
      bundleError = err
      this.emit('end')
    })
    buildBundle.pipe(fs.createWriteStream(output))
    buildBundle.pipe(concat({encoding: 'string'}, function(content) {
      bundleContent = content
      requestQueue.forEach(function(item) { item.res.send(bundleContent) })
      requestQueue = []
    }))
  }

  build() // First build.

  bundle.on('update', function() {
    console.log('watchify file updated')
    build()
  })

  app.get(relative, function(req, res, next) {
    res.type('.js')
    if (bundleContent) return res.send(bundleContent)
    requestQueue.push({req: req, res: res, next: next})
  })
}
