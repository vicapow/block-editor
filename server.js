var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var config = require('./config')

var jsonParser = bodyParser.json({type: 'text/json'})

app.use(function(req, res, next) {
  console.log(req.url)
  next()
})

app.get('/:username/:hash/index.html', jsonParser, function(req, res, next) {
  console.log(req.params.username)
  console.log(req.params.hash)
  res.set('X-XSS-Protection', '0')
  var body = req.body
  res.send(req.query.content)
})

app.use(express.static(__dirname))

require('./bundler.js')(app)

var server = app.listen(config.port)