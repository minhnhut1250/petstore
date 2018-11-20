var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var User = new Schema({
 fullname 		: String,
 img 			: String,
 username       : String,
 password 		: String,

},{collection : 'user'});

module.exports = mongoose.model('User', User);