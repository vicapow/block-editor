var argv = require('minimist')(process.argv.slice(2))
var config = {
  port: argv.port || 3000,
  debugBrowserify: true,
  minify: false,
  staticOutputDir: './client'
}
module.exports = config