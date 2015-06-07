'use strict'
var EventEmitter = require('events').EventEmitter
var dispatcher = require('./../dispatcher')
var EditorConstants = require('./../constants/editor-constants')
var EditorActions = require('./../actions/editor-actions')

console.log('editor store!')

var data = {
}

var CHANGE_EVENT = 'change'

var EditorStore = Object.assign({}, EventEmitter.prototype, {
  addChangeListener(cb) { this.on(CHANGE_EVENT, cb) },
  removeChangeListener(cb) { this.removeListener(CHANGE_EVENT, cb) },
})

dispatcher.register(action => {
  if (action.actionType === EditorConstants.EDITOR_RECEIVED_BLOCK_CONTENT) {
    data.id = action.id
    EditorStore.emit(CHANGE_EVENT)
  }else {
    // no op.
  }
})

module.exports = EditorStore
