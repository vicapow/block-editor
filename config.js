var parseArgs = require('minimist')
var argv = parseArgs(process.argv.slice(2), {
  default: {
    'clear-cached-common-bundle': 'true',
  }
})
console.dir(argv)

var config = {
  port: argv.port || 3000,
  debugBrowserify: true,
  minify: false,
  watchify: true,
  staticOutputDir: './client',
  clearCachedCommonBundle: argv['clear-cached-common-bundle'] === 'true',
}
module.exports = config
