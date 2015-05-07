var React = require('react')
var bootstrap = {
  'pages/index': require('./pages/index.react.js'),
  'pages/editor': require('./pages/editor.react.js'),
  init: function(path, container) {
    var App = bootstrap[path]
    if (!App) throw new Error('Unknown app path ' + path)
    container = container || document.body
    React.render(React.createElement(App), container)
  },
}

module.exports = bootstrap
