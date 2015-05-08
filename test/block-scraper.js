var blockScraper = require('../src/block-scraper.js')
var should = require('should')

var exampleBlockURL = 'http://bl.ocks.org/vicapow/a0b57132c6c6d798aadf'

describe('block-scraper', function() {
  describe('#getBlock', function() {
    it('should return the gist info given the block data', function(done) {
      blockScraper.getBlock(exampleBlockURL, function(err, res) {
        if (err) return done(err)
        console.log(res)
        done()
      })
    })
  })
})
