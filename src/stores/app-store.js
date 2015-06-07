'use strict'
var EventEmitter = require('events').EventEmitter
var dispatcher = require('./../dispatcher')
var AppConstants = require('./../constants/app-constants')
var EditorActions = require('./../actions/editor-actions')
var request = require('superagent')

var data = {
  // The default route.
  route: '/',
  isLoading: false,
}

function submitBlockURL({blockURL}) {
  if (data.isLoading) return
  data.isLoading = true
  request.post('/api/block-edit/')
    .query({blockURL})
    .accept('json')
    .end((err, res) => {
      if (err) throw err
      var id = res.body.id
      Object.assign(data, {isLoading: false, route: '/editor/' + id})
      EditorActions.receivedBlockContent({id})
      AppStore.emit(CHANGE_EVENT)
    })
}

var CHANGE_EVENT = 'change'

var AppStore = Object.assign({}, EventEmitter.prototype, {
  getRoute() { return data.route },
  addChangeListener(cb) { this.on(CHANGE_EVENT, cb) },
  removeChangeListener(cb) { this.removeListener(CHANGE_EVENT, cb) },
})

dispatcher.register(action => {
  if (action.actionType === AppConstants.APP_UPDATE_ROUTE) {
    data.route = action.route
    AppStore.emit(CHANGE_EVENT)
  } else if (action.actionType === AppConstants.APP_SUBMIT_BLOCK_URL) {
    submitBlockURL(action)
    AppStore.emit(CHANGE_EVENT)
  }else {
    // no op.
  }
})

module.exports = AppStore
