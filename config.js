'use strict'
var path = require('path')
var parseArgs = require('minimist')
var mkdirp = require('mkdirp')
var secrets = require('./secrets.js') // All the secrets we can't commit.
var argv = parseArgs(process.argv.slice(2), {
  default: {
    'clear-cached-common-bundle': 'true',
  }
})

var config = {
  protocol: argv.protocol || 'http:',
  hostname: argv.hostname || 'localhost',
  port: argv.port || 3000,
  debugBrowserify: true,
  debug: true,
  minify: false,
  watchify: true,
  staticOutputDir: './client',
  blocksDir: './client/_blocks',
  blocksMetadataDir: './client/_blocks-metadata',
  clearCachedCommonBundle: argv['clear-cached-common-bundle'] === 'true',
  sessionSecret: secrets.sessionSecret || '',
  sessionsDir: './.tmp/sessions',
  hashIdSalt: secrets.hashIdSalt,
  githubBasicClientId: secrets.githubBasicClientId,
  githubBasicSecretId: secrets.githubBasicSecretId,
  githubAccessScope: 'gist',
  githubLoginURI: '/auth/login/github',
  githubCallbackURI: '/auth/callback/github',
  pwd: process.cwd(),
}


config.absoluteStaticOutputDir = path.join(config.pwd, config.staticOutputDir)

mkdirp.sync(config.sessionsDir)

// Computed config properties.
config.baseURL = config.protocol + '//' + config.hostname
if (config.port !== 80) {
  config.baseURL = config.baseURL + ':' + config.port
}
console.log('---Configuration---')
console.log('baseURL:', config.baseURL)

module.exports = config
