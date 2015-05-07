'use strict'
var React = require('react')
var IndexApp = React.createClass({
  getInitialState() {
    return {}
  },
  render() {
    var content = this.state.iframeContent;
    return <div>
      <h1>bl.ock editor</h1>
      <p>
        makes it easy to create or remix existing bl.ocks from <a href="http://bl.ocks.org">bl.ocks.org</a>.
      </p>
    </div>
  }
})

module.exports = IndexApp
