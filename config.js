var argv = require('minimist')(process.argv.slice(2))
var config = {
  port: argv.port || 3000,
  debugBrowserify: true,
  minify: true,
  watchify: true,
  staticOutputDir: './client'
}
module.exports = config
