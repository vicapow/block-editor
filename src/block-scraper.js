'use strict'
var fs = require('fs')
var UrlParser = require('url')
var path = require('path')
var request = require('request')
var GithubApi = require('github')
var mkdirp = require('mkdirp')
var async = require('async')
var config = require('./../config')
var blockMetadata = require('./block-metadata')

var github = new GithubApi({
  version: '3.0.0',
  debug: config.debug,
  timeout: 5000,
  headers: {
    'user-agent': 'Block-Editor',
  }
})

module.exports = {
  getBlock(blockURL, cb) {
    var url = UrlParser.parse(blockURL, true)
    if (url.hostname === 'bl.ocks.org')
      url.host = url.hostname = 'gist.github.com'
    else if (url.hostname !== 'gist.github.com')
      return cb(null, {
        status: 'failed',
        type: 'url-format',
        message: 'Urls must be from bl.ocks.org or gist.github.com',
        hostname: url.hostname,
      })
    var id = path.parse(url.pathname).name
    github.gists.get({id}, (err, res) => {
      if (err) return cb(err)
      var blockDir = path.join(process.cwd(), config.blocksDir, id)
      var filenames = Object.keys(res.files)
      var files = filenames.map(key => res.files[key])
      mkdirp(blockDir, (err) => {
        async.eachLimit(files, 100, (file, cb) => {
          fs.writeFile(path.join(blockDir, file.filename), file.content, cb)
        }, (err) => {
          if (err) return cb(err)
          blockMetadata.get(id, (err, metadata) => {
            if (err) return cb(err)
            metadata.latestVersion = res.history[0].version
            blockMetadata.set(id, metadata, (err) => {
              if (err) return cb(err)
              else return cb({id})
            })
          })
        })
      })
    })
  }
}
