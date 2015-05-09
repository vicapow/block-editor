'use strict'
var React = require('react')
var request = require('superagent')
var HomePage = React.createClass({
  getInitialState() {
    return {}
  },
  _submitBlock(e) {
    request.get('/api/block-data/')
      .query({blockURL: this.state.blockURL})
      .accept('json')
      .end(function(err, res) {
        if (err) throw err
        console.log(res)
      })
  },
  _onChangeBlockURL(e) {
    this.setState({blockURL: e.target.value})
  },
  render() {
    var {state} = this
    var {blockURL} = state
    return <div>
      <h1>bl.ocks editor</h1>
      <p>
        makes it easy to create or remix existing bl.ocks from <a href="http://bl.ocks.org">bl.ocks.org</a>.
      </p>
      <p>
        Paste the block URL here:
      </p>
      <input type="text" value={blockURL} style={{width: 500}}
        onChange={this._onChangeBlockURL}/>
      <button onClick={this._submitBlock}>go</button>
    </div>
  }
})

module.exports = HomePage
