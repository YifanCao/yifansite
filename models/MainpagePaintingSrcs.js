var mongoose = require('mongoose');

var MainpagePaintingSrcSchema = new mongoose.Schema({src : String});

module.exports = mongoose.model('mainpagepaintingsrcs', MainpagePaintingSrcSchema);