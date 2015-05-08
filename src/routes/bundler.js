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
  // Example of a local alias:
  // {name: 'color', alias: './client/scripts/src/color'},
]

module.exports = function(app) {
  setupCommonBundleAndRoute(app)
  setupMainBundleAndRoute(app)
}

function setupCommonBundleAndRoute(app) {
  var relative = '/_build/js/common.js'
  var output = path.join(config.absoluteStaticOutputDir, relative)
  mkdirp(path.dirname(output), function(err, res) {
    if(err) throw err
    if (config.clearCachedCommonBundle) {
      fs.unlink(output, function(err) {
        // We don't care if the file doesn't already exist.
        generateCommonBundle(relative, output, app)
      })
    } else {
      generateCommonBundle(relative, output, app)
    }
  })
}

function generateCommonBundle(relative, output, app) {
  fs.exists(output, function(exists) {
    if (exists && !config.clearCachedCommonBundle) {
      fs.readFile(output, function(err, content) {
        if (err) throw err
        gotBundle(content.toString('utf-8'))
      })
    } else {
      // generate new version.
      var bundle = browserify({
        debug: config.debugBrowserify,
        minify: config.minify,
      })

      commonSharedModules.forEach(function(module) {
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
      bundle.pipe(concat({encoding: 'string'}, gotBundle))
    }
  })

  var bundleContent
  var requestQueue = []
  function gotBundle(content) {
    bundleContent = content
    requestQueue.forEach(function(item) { item.res.send(bundleContent) })
    requestQueue = []
  }

  app.get(relative, function(req, res, next) {
    res.type('.js')
    if (bundleContent) return res.send(bundleContent)
    requestQueue.push({req: req, res: res, next: next})
  })
}

function setupMainBundleAndRoute(app) {
  var relative = '/_build/js/entry.js'
  var output = path.join(__dirname, '../', config.staticOutputDir, relative)
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

  bundle.require('./src/bootstrap.js')

  // React + ES6ify.
  bundle.transform(babelify.configure({
    optional: ['runtime', 'es7.objectRestSpread'],
  }))
  if (browserifyArgs.minify) bundle.transform({global: true}, 'uglifyify')

  var bundleContent
  var requestQueue = []
  function build() {
    bundleContent = undefined
    var buildBundle = bundle.bundle()
    buildBundle.on('error', function(err) {
      console.error(err.message)
      this.emit('end')
    })
    buildBundle.pipe(fs.createWriteStream(output))
    buildBundle.pipe(concat({encoding: 'string'}, function(content) {
      console.log('finished bundling content', content.length)
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
    console.log('request for entry file')
    if (bundleContent) return res.send(bundleContent)
    requestQueue.push({req: req, res: res, next: next})
  })
}
