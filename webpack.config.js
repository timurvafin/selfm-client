var opts = require('./opts')

var config = require('./webpack/collect_pieces.js')(opts)
          
module.exports = config