var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({name : String, password: String, role: String});

module.exports = mongoose.model('users', UserSchema);