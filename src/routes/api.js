var config = require('../../config')
var Hashids = require('hashids')
var hashids = new Hashids(config.hashIdSalt)

module.exports = (app) => {
  app.post('/api/block-edit', (req, res, next) => {
    var {blockURL} = req.body
    blockScraper.getBlock(exampleBlockURL, (err, res) => {
      if (err) return next(err)
      res.json(res)
    })
  })
}
