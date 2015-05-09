'use strict'
var fs = require('fs')
var vm = require('vm')
var path = require('path')

// This is all to avoid having node parse all of the page dependencies while
// also being able to specify the routes in a single place.
// TODO: this is gross but good enough for now. In the future, this could be
// done with Esprima.

var content = fs.readFileSync(path.join(__dirname, 'index.js'))
var sandbox = {module: {}, require: function() { return true }}

vm.createContext(sandbox)
vm.runInContext(content, sandbox)

var routes = Object.keys(sandbox.module.exports)

module.exports = routes
