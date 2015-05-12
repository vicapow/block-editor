'use strict'

var dispatcher = require('../dispatcher')
var EditorConstants = require('../constants/editor-constants')

var EditorActions = {
  receivedBlockContent({blockContent}) {
    var actionType = EditorConstants.EDITOR_RECEIVED_BLOCK_CONTENT
    dispatcher.dispatch({blockContent, actionType})
  }
}

module.exports = EditorActions
