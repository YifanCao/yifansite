var mongoose = require('mongoose');

var PaintingSrcSchema = new mongoose.Schema({src : String});

module.exports = mongoose.model('PaintingSrc', PaintingSrcSchema);