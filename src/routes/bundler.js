'use strict'
var path = require('path')
var fs = require('fs')
var browserify = require('browserify')
var watchify = require('watchify')
var through = require('through')
var concat = require('concat-stream')
var mkdirp = require('mkdirp')
var xtend = require('xtend')
var babelify = require('babelify')
var config = require('../../config')

var commonSharedModules = [
  {name: 'd3'},
  {name: 'react'},
  {name: 'react-code-mirror'},
  {name: 'codemirror'},
  {name: 'codemirror/mode/javascript/javascript'},
  {name: 'codemirror/mode/xml/xml'},
  {name: 'codemirror/mode/css/css'},
  {name: 'codemirror/mode/htmlmixed/htmlmixed'},
  {name: 'react/addons'},
  {name: 'superagent'},
  {name: 'events'},
  {name: 'keymirror'},
  {name: 'babel-runtime/core-js/object/assign'},
  // Example of a local alias:
  // {name: 'color', alias: './client/scripts/src/color'},
]

module.exports = function(app) {
  setupCommonBundleRoute(app)
  setupMainBundleRoute(app)
}

function setupCommonBundleRoute(app) {
  var relative = '/_build/js/common.js'
  var output = path.join(config.absoluteStaticOutputDir, relative)
  var bundleContent = null
  var requestQueue = []
  app.get(relative, function(req, res, next) {
    res.type('.js')
    if (bundleContent) return res.send(bundleContent)
    requestQueue.push({req, res, next})
  })
  mkdirp(path.dirname(output), function(err, res) {
    if(err) throw err
    if (config.clearCachedCommonBundle) {
      fs.unlink(output, function(err) {
        // We don't care if the file doesn't already exist.
        generateCommonBundle(relative, output, done)
      })
    } else {
      generateCommonBundle(relative, output, done)
    }
  })
  function done(content) {
    bundleContent = content
    console.log('packaged common bundle', content.length)
    requestQueue.forEach(({res}) => res.send(bundleContent))
    requestQueue = []
  }
}

function generateCommonBundle(relative, output, cb) {
  fs.exists(output, exists => {
    if (exists && !config.clearCachedCommonBundle) {
      fs.readFile(output, (err, content) => {
        if (err) throw err
        gotBundle(content.toString('utf-8'))
      })
    } else {
      // generate new version.
      var bundle = browserify({
        debug: config.debugBrowserify,
        minify: config.minify,
      })

      commonSharedModules.forEach(module => {
        if (!module.alias) bundle.require(module.name)
        else bundle.require(module.alias, {expose: module.name})
      })

      if (config.minify) bundle.transform({global: true}, 'uglifyify')

      bundle = bundle.bundle()
        .on('error', function(err) {
          console.error('bundle.on error common')
          throw err
          this.emit('end')
        })
      // Save the bundle to disk.
      bundle.pipe(fs.createWriteStream(output))
      // But also buffer the output into memory.
      bundle.pipe(concat({encoding: 'string'}, cb))
    }
  })
}

function setupMainBundleRoute(app) {
  var relative = '/_build/js/entry.js'
  var output = path.join(config.absoluteStaticOutputDir, relative)
  var bundleContent = null
  var requestQueue = []
  app.get(relative, function(req, res, next) {
    res.type('.js')
    if (bundleContent) return res.send(bundleContent)
    requestQueue.push({req, res, next})
  })
  mkdirp(path.dirname(output), (err, res) => {
    if(err) throw err
    fs.unlink(output, () => generateMainBundle(output, start, finish))
  })
  function start() { bundleContent = null }
  function finish(content) {
    console.log('packaged entry bundle', content.length)
    bundleContent = content
    requestQueue.forEach(({res}) => res.send(content))
    requestQueue = []
  }
}

function generateMainBundle(output, start, finish) {
  var browserifyArgs = {debug: config.debugBrowserify, minify: config.minify}
  var bundle
  if (config.watchify) {
    bundle = watchify(browserify(xtend(watchify.args, browserifyArgs)), {
      delay: 0,
    })
  } else {
    bundle = browserify(browserifyArgs)
  }
  commonSharedModules.forEach(module => bundle.external(module.name))

  bundle.require('./src/bootstrap.js', {expose: 'bootstrap'})

  // React + ES6 transform.
  bundle.transform(babelify.configure({
    optional: ['runtime', 'es7.objectRestSpread'],
  }))
  if (browserifyArgs.minify) bundle.transform({global: true}, 'uglifyify')

  function build() {
    start()
    var buildBundle = bundle.bundle()
    buildBundle.on('error', function(err) {
      console.error(err.message)
      this.emit('end')
    })
    buildBundle.pipe(fs.createWriteStream(output))
    buildBundle.pipe(concat({encoding: 'string'}, finish))
  }

  build() // First build.

  bundle.on('update', function() {
    console.log('watchify file updated')
    build()
  })
}
