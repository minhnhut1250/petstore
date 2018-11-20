var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Cart = new Schema({
  name 		:  String,
  date: String,
  email 	: String,
  address: String,
  sdt 		: String,
  msg 		: String,
  cart 		: Object,
  st 		: Number

},{collection : 'cart'});

module.exports = mongoose.model('Cart', Cart);