'use strict'
var React = require('react')
var VisDisplay = require('../vis-display.react')
var CodeMirror = require('react-code-mirror')
// CodeMirror is not CommonJS compatible.
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/xml/xml')
require('codemirror/mode/css/css')
require('codemirror/mode/htmlmixed/htmlmixed')

var template = require('../../default-editor-template')

var EditorPage = React.createClass({
  getInitialState() {
    return {
      iframeContent: template,
    }
  },
  _handleEditorChange(e) {
    this.setState({iframeContent: e.target.value})
  },
  render() {
    var content = this.state.iframeContent
    return <div>
      <h1> Hello from react!</h1>
      <VisDisplay content={content}/>
      <CodeMirror
        value={content}
        mode='htmlmixed'
        onChange={this._handleEditorChange} />
    </div>
  }
})

module.exports = EditorPage
