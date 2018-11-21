var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb://nhut:nhutlui123@ds042677.mlab.com:42677/test"; // connect online

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

