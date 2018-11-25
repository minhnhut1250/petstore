var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    googleId: String,
    email: String,
    name: String
  },{collection : 'users'});

module.exports = mongoose.model('users', userSchema);