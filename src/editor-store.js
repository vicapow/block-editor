'use strict'
var EventEmitter = require('events').EventEmitter
var dispatcher = require('./dispatcher')
var AppConstants = require('./constants/app-constants')
var request = require('superagent')

var editorData = {
  files: {
  }
}
