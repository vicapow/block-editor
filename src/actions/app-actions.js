'use strict'

var dispatcher = require('../dispatcher')

var AppActions = {
  setRoute(route) {
    dispatcher.dispatch({route})
  }
}

module.exports = AppActions
