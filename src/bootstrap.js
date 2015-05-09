'use strict'
var React = require('react')
var App = require('./app.react')
var bootstrap = {
  init(props, container) {
    container = container || document.body
    React.render(<App {...props} />, container)
  },
}

module.exports = bootstrap
