'use strict'
var fs = require('fs')
var path = require('path')
var less = require('less')
var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var config = require('./config')

var app = express()

app.set('view engine', 'jade')
app.set('views', './src/views')
app.use(function(req, res, next) {
  console.log(req.url)
  next()
})

app.use(session({
  store: new FileStore({path: config.sessionsDir}),
  secret: config.sessionSecret,
}))

app.get('/', function(req, res, next) {
  res.render('index')
})

app.get('/_build/css/:filename', function(req, res, next) {
  var parts = path.parse(req.params.filename)
  if (parts.ext !== '.css') {
    console.log('unknown style extension', parts.ext)
    return res.sendStatus(404)
  }
  var filename = path.join(parts.dir, parts.name + '.less')
  fs.readFile('./src/less/' + filename, function(err, content) {
    if (err) return next(err)
    var opts = {
      paths: ['./src/less'],
    }
    less.render(content.toString('utf-8'), opts, function(err, output) {
      if (err) return next(err)
      res.type('.css')
      res.send(output.css)
    })
  })
})

var jsonParser = bodyParser.json({type: 'text/json'})

app.get('/iframe', jsonParser, function(req, res, next) {
  res.set('X-XSS-Protection', '0')
  var content = req.query.content
  return res.send(content)
})

app.use(express.static(path.join(process.cwd(), config.staticOutputDir)))

require('./src/routes/bundler')(app)
require('./src/routes/auth')(app)
require('./src/routes/api')(app)

var server = app.listen(config.port)
