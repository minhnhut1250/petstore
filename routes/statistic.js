var express = require('express');
var router = express.Router();

var Cart = require('../model/Cart.js');
var Cate = require('../model/Cate.js');
var Product = require('../model/Product');

router.get('/', checkAdmin, function (req, res) {
	res.redirect('/admin/san-pham/qly-san-pham')
});

router.post('/getUser', checkAdmin, function (req, res) {
	res.json(req.user);
});


function checkAdmin(req, res, next) {

	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/admin');
	}
}

module.exports = router;
