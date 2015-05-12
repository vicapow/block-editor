var config = require('../../config')
var Hashids = require('hashids')
var hashids = new Hashids(config.hashIdSalt)

module.exports = (app) => {
  app.get('/api/block-data', (req, res, next) => {
    var {blockURL} = req.query
    blockScraper.getBlock(exampleBlockURL, (err, res) => {
      if (err) return next(err)
      res.json(res)
    })
  })
}
