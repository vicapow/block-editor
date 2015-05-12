'use strict'
var React = require('react')
var AppStore = require('./stores/app-store')
var AppActions = require('./actions/app-actions')
var Pages = require('./components/pages')

function getAppState() {
  return {
    route: AppStore.getRoute(),
  }
}

var App = React.createClass({
  getInitialState() {
    return {}
  },
  componentDidMount() {
    AppStore.addChangeListener(this._onChange)
    // Set the first route.
    AppActions.updateRoute({route: this.props.initialRoute})
  },
  componentDidUnmount() {
    AppStore.removeChangeListener(this._onChange)
  },
  render() {
    var {props, state} = this
    var Page = Pages[state.route]
    if (!Page && state.route.match(/\/editor\/.+/)) Page = Pages.editor
    var pageContent = Page ? <Page route={state.route} /> : null
    return <div>
      {pageContent}
      <code>
        <pre>
          Props:
          {JSON.stringify(props, null, 2)}
          {"\n\n"}
          State:
          {JSON.stringify(state, null, 2)}
        </pre>
      </code>
    </div>
  },
  _onChange() {
    this.setState(getAppState())
  }
})

module.exports = App
