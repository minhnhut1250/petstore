var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var staffSchema = new Schema({
 fullname 		: String,
 img 			: String,
 username       : String,
 password 		: String,

},{collection : 'staff'});

module.exports = mongoose.model('Staff', staffSchema);