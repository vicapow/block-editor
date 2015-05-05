var path = require('path')
var fs = require('fs')
var browserify = require('browserify')
var through = require('through')
var config = require('./config')

var commonSharedModules = [
  {name: 'd3'},
  {name: 'react'},
  // Example of a local alias:
  // {name: 'color', alias: './client/scripts/src/color'},
]

module.exports = function(app) {
  var relative = '/_build/js/third-party.js'
  var output = path.join(__dirname, locals.staticOutputDir, relative)
  mkdirp(path.dirname(output), function(err, res) {
    if(err) throw err
    fs.unlink(output, function(err) {
      // We don't care if the file doesn't already exist.
      generateThirdPartyBundle(relative, output, cb)
    })
  })
}

function generateThirdPartyBundle(relative, output, cb) {
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
  bundle
    .on('error', function(err) {
      bundleError = err
      this.emit('end')
    })
    .bundle()
    .pipe(res)
  bundle.pipe(fs.createWriteStream(output))
  bundle.pipe(through(function write(buf) {
     chunks.push(buf)
  }, function end() {
    finalBuffer = Buffer.concat(chunks)
  })
  app.get(relative, function(req, res, next) {
    })
  })
}
