'use strict'
var dispatcher = require('./dispatcher')
var EventEmitter = require('events').EventEmitter
var assign = require('object-assign')

var CHANGE_EVENT = 'change'

var appData = {}

// The default page.
var route = '/'

var AppStore = Object.assign({}, EventEmitter.prototype, {
  getRoute() {
    return route
  },
})

dispatcher.register(action => {
  if (action.type === 'app-set-route') {
    route = action.route
  } else {
    // no op.
  }
})
