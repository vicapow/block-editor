'use strict'

var dispatcher = require('../dispatcher')
var AppConstants = require('../constants/app-constants')

var AppActions = {
  updateRoute({route}) {
    dispatcher.dispatch({route, actionType: AppConstants.APP_UPDATE_ROUTE})
  }
}

module.exports = AppActions
