var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    address: String,
    phone: String,
    password: String,
});
module.exports = mongoose.model('Users', userSchema);