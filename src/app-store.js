'use strict'
var EventEmitter = require('events').EventEmitter
var dispatcher = require('./dispatcher')
var AppConstants = require('./constants/app-constants')

var appData = {
  // The default route.
  route: '/',
}

var CHANGE_EVENT = 'change'

var AppStore = Object.assign({}, EventEmitter.prototype, {
  getRoute() {
    return appData.route
  },
  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb)
  },
})

dispatcher.register(action => {
  if (action.type === AppConstants.APP_UPDATE_ROUTE) {
    route = action.route
    AppStore.emit(CHANGE_EVENT)
  } else {
    // no op.
  }
})

module.exports = AppStore
