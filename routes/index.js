var express = require('express');
var router = express.Router();

var Cate = require('../model/Cate.js');
var Product = require('../model/Product.js');
var GioHang = require('../model/giohang.js');
var Cart = require('../model/Cart.js');

var countJson = function (json) {
	var count = 0;
	for (var id in json) {
		count++;
	}

	return count;
}

/* GET home page. */
router.get('/trang-chu', function (req, res) {
	Product.find().then(function (product) {
		Cate.find().then(function (cate) {
			res.render('site/page/index', {
				product: product,
				cate: cate
			});
		});
	});
});

router.get('/lien-he', function (req, res) {
	res.render('site/page/contact');
});

router.get('/cate/:name.:id', function (req, res) {

	Product.find({
		cateId: req.params.id
	}, function (err, data) {
		Cate.find().then(function (cate) {
			res.render('site/page/cate', {
				product: data,
				cate: cate
			});
		});
	});
});

router.get('/dat-hang', function (req, res) {
	var giohang = new GioHang((req.session.cart) ? req.session.cart : {
		items: {}
	});
	var data = giohang.convertArray();

	if (req.session.cart) {
		if (countJson(req.session.cart.items) > 0) {
			res.render('site/page/checkout', {
				errors: null,
				data: data
			});
		} else res.redirect('/trang-chu');

	} else {
		res.redirect('/trang-chu');
	}
});

router.post('/dat-hang', function (req, res) {
	req.checkBody('name', 'Tên không được rổng').notEmpty();
	req.checkBody('email', 'Email không được rỗng').notEmpty();
	req.checkBody('address', 'Địa chỉ không được rổng').notEmpty();
	req.checkBody('phone', 'SDT không được rỗng').notEmpty();
	req.checkBody('message', 'Tin nhắn không được rổng').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		var giohang = new GioHang((req.session.cart) ? req.session.cart : {
			items: {}
		});
		var data = giohang.convertArray();

		if (req.session.cart) {
			if (countJson(req.session.cart.items) > 0) {
				res.render('site/page/checkout', {
					errors: errors,
					data: data
				});
			} else res.redirect('/trang-chu');

		} else {
			res.redirect('/trang-chu');
		}
	} else {
		var giohang = new GioHang((req.session.cart) ? req.session.cart : {
			items: {}
		});
		var data = giohang.convertArray();

		var cart = new Cart({
			name: req.body.name,
			date: Date.now(),
			email: req.body.email,
			address: req.body.address,
			sdt: req.body.phone,
			msg: req.body.message,
			cart: data,
			st: 0
		});
		cart.save().then(function () {
			req.session.cart = {
				items: {}
			};
			req.flash('success_msg', 'Đã Đặt Hàng Thành Công ');
			res.redirect('/trang-chu');
		});
	}
});

// router.get('/don-hang/:id', function (req, res) {

// 	var id = req.params.id;
// 	Cart.findById(id).then(function(data){
// 		res.render('site/page/bill', {cart: data});
//    });

// });

router.post('/menu', function (req, res) {
	Cate.find().then(function (data) {
		res.json(data);
	});
});

router.get('/add-cart.:id', function (req, res) {
	var id = req.params.id;
	var giohang = new GioHang((req.session.cart) ? req.session.cart : {
		items: {}
	});
	Product.findById(id).then(function (data) {
		giohang.add(id, data);
		req.session.cart = giohang;
		res.redirect('/gio-hang');
	});
});

router.get('/gio-hang', function (req, res) {
	var giohang = new GioHang((req.session.cart) ? req.session.cart : {
		items: {}
	});

	var data = giohang.convertArray();
	res.render('site/page/minicart', {
		data: data
	});
});

router.post('/updateCart', function (req, res) {
	var id = req.body.id;
	var soluong = req.body.soluong;
	var giohang = new GioHang((req.session.cart) ? req.session.cart : {
		items: {}
	});
	giohang.updateCart(id, soluong);
	req.session.cart = giohang;
	res.json({
		st: 1
	});
});

router.post('/delCart', function (req, res) {
	var id = req.body.id;
	var giohang = new GioHang((req.session.cart) ? req.session.cart : {
		items: {}
	});

	giohang.delCart(id);
	req.session.cart = giohang;
	res.json({
		st: 1
	});

});


router.get('/test', function (req, res) {
	res.send('a');
});

router.get('/san-pham', function (req, res) {
	var pageSize = 9
	var currentPage = req.query.page || 1
	Cate.find().then(function(cate){
		Product.find().skip((pageSize * currentPage) - pageSize).limit(pageSize).exec((err, product) => {
			Product.count().exec((err, count) => {
				if (err) return next(err)
				res.render('site/page/products', {
					product: product,
					currentPage: currentPage,
					cate: cate,
					pageCount: Math.ceil(count / pageSize)
				})
			})
		})
	});
});


router.get('/san-pham/:name.:id', function (req, res) {
	Product.find({
		cateId: req.params.id
	}, function (err, data) {
		Cate.find().then(function (cate) {
			res.render('site/page/products', {
				product: data,
				cate: cate
			});
		});
	});
});

router.get('/chi-tiet/:name.:id.:cate', function (req, res) {
	Product.findById(req.params.id).then(function (data) {
		Product.find({
			cateId: data.cateId,
			_id: {
				$ne: data._id
			}
		}).limit(4).then(function (pro) {
			res.render('site/page/single', {
				data: data,
				product: pro
			});
		});
	});

});


module.exports = router;