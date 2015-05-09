'use strict'
var React = require('react')
var NotFoundPage = React.createClass({
  render() {
    return <div>
      <h1>404</h1>
      <p>
        We couldn't find that page.
      </p>
    </div>
  }
})

module.exports = NotFoundPage
