module.exports = function(app) {
  app.get('/api/block-data', function(req, res, next) {
    var blockURL = req.query.blockURL
    console.log('blockURL', blockURL)
    res.sendStatus(200)
  })
}
