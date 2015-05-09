'use strict'
var React = require('react')
var PureRenderMixin = require('react/addons').addons.PureRenderMixin

var VisDisplay = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    /**
     * The HTML template string to render in the iframe.
     */
    content: React.PropTypes.string.isRequired,
  },
  _style: {
    width: 960,
    height: 500,
    border: '1px solid #DEDEDE',
  },
  getInitialState() {
    var initState = {
      iframeSrc: undefined
    }
    return this._updateStateFromProps(this.props, initState)
  },
  componentWillReceiveProps(newProps) {
    this.setState(this._updateStateFromProps(newProps))
  },
  _updateStateFromProps(props, state) {
    state = state || this.state
    // Modify state.
    var stateChanges = {
      iframeSrc: '/iframe?content=' + encodeURIComponent(props.content),
    }
    return stateChanges
  },
  render() {
    return <iframe
      src={this.state.iframeSrc}
      style={this._style}
      scrolling='no' />
  }
})

module.exports = VisDisplay;
