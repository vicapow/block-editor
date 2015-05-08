'use strict'
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var config = require('../config')
var metadataDir = path.join(process.cwd(), config.blocksMetadataDir)

function metadataFilename(id) {
  return path.join(metadataDir, id, 'metadata.json')
}

module.exports = {
  get: function(id, cb) {
    var filename = metadataFilename(id)
    fs.exists(filename, function(exists) {
      if (!exists) return cb(null, {})
      else fs.readFile(filename, function(err, res) {
        if (err) return cb(err)
        else return cb(null, JSON.parse(res))
      })
    })
  },
  set: function(id, metadata, cb) {
    var filename = metadataFilename(id)
    var content = JSON.stringify(metadata, null, 2)
    var dir = path.dirname(filename)
    mkdirp(dir, function(err) {
      if (err) return cb
      fs.writeFile(filename, content, cb)
    })
  }
}
