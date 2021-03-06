'use strict'

var dispatcher = require('../dispatcher')
var AppConstants = require('../constants/app-constants')

var AppActions = {
  updateRoute({route}) {
    dispatcher.dispatch({route, actionType: AppConstants.APP_UPDATE_ROUTE})
  },
  submitBlockURL({blockURL}) {
    var actionType = AppConstants.APP_SUBMIT_BLOCK_URL
    dispatcher.dispatch({blockURL, actionType})
  }
}

module.exports = AppActions
