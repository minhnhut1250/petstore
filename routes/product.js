var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/upload')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '_' + file.originalname);
	}
});

var upload = multer({
	storage: storage
});

var Cate = require('../model/Cate.js');
var Product = require('../model/Product.js');

/* GET home page. */
router.get('/', checkAdmin, function (req, res) {
	res.redirect('/admin/san-pham/qly-san-pham')
});

router.get('/qly-san-pham', checkAdmin, function (req, res) {
	var pageSize = 10
	var currentPage = req.query.page || 1
	Cate.find().then(function (cate) {
		Product.find().skip((pageSize * currentPage) - pageSize).limit(pageSize).exec((err, pro) => {
			Product.count().exec((err, count) => {
				if (err) return next(err)
				res.render('admin/product/view', {
					errors: null,
					product: pro,
					currentPage: currentPage,
					cate: cate,
					pageCount: Math.ceil(count / pageSize)
				})
			})
		})
	});
});

router.post('/qly-san-pham', checkAdmin, upload.single('hinh'), function (req, res) {
	req.checkBody('name', 'Tên không được rổng').notEmpty();
	// req.checkBody('hinh', 'Hình không được rổng').notEmpty();
	req.checkBody('gia', 'giá phải là số').isInt();
	req.checkBody('des', 'Chi tiết không được rổng').notEmpty();
	console.log(req.file);
	var errors = req.validationErrors();
	if (errors) {
		var file = './public/upload/' + req.file.filename;
		var fs = require('fs');
		fs.unlink(file, function (e) {
			if (e) throw e;
		});
		Product.find().then(function (pro) {
			Cate.find().then(function (cate) {
				res.render('admin/product/view', {
					errors: errors,
					cate: cate,
					product: pro
				});
			});
		});

	} else {
		var pro = new Product({
			name: req.body.name,
			img: req.file.filename,
			cateId: req.body.cate,
			des: req.body.des,
			price: req.body.gia,
			promotion: req.body.giamgia,
			quantity: req.body.soluong,
			st: 0
		});
		pro.save().then(function () {
			req.flash('success_msg', 'Đã Thêm Thành Công Sản Phẩm ');
			res.redirect('/admin/san-pham/qly-san-pham');
		});
	}
});

// router.get('/:id/sua',checkAdmin, function (req, res) {
// 	Product.findById(req.params.id).then(function (pro) {
// 		Cate.find().then(function (cate) {
// 			res.render('admin/product/edit', {
// 				errors: null,
// 				cate: cate,
// 				product: pro
// 			});
// 		});
// 	});

// });

router.post('/qly-san-pham/sua', checkAdmin ,upload.single('hinh'), function (req, res) {
	req.checkBody('name', 'Tên không được rổng').notEmpty();
	// req.checkBody('hinh', 'Hình không được rổng').notEmpty();
	req.checkBody('gia', 'giá phải là số').isInt();
	req.checkBody('des', 'Chi tiết không được rổng').notEmpty();
	var id = req.body.id;

	var errors = req.validationErrors();
	if (errors) {

		var file = './public/upload/' + req.file.filename;
		var fs = require('fs');
		fs.unlink(file, function (e) {
			if (e) throw e;
		});

		Product.findById(id).then(function (pro) {
			Cate.find().then(function (cate) {
				res.render('admin/product/view', {
					errors: errors,
					cate: cate,
					product: pro
				});
			});
		});
	} else {
		Product.findOne({
			_id: id
		}, function (err, data) {
			var file = './public/upload/' + data.img;
			var fs = require('fs');
			fs.unlink(file, function (e) {
				if (e) throw e;
			});
			data.name = req.body.name;
			data.img = req.file.filename;
			data.cateId = req.body.cate;
			data.des = req.body.des;
			data.price = req.body.gia;
			data.promotion = req.body.giamgia;
			data.quantity = req.body.soluong,
			data.st = '0';

			data.save();
			req.flash('success_msg', 'Đã Sửa Thành Công Sản Phẩm ');
			res.redirect('/admin/san-pham/qly-san-pham');

		});

	}

});

// router.get('/them-product.html', checkAdmin, function (req, res) {
// 	Cate.find().then(function(cate){
// 		res.render('admin/product/them',{errors: null, cate: cate});
// 	});
// });


router.get('/:id/xoa', checkAdmin, function (req, res) {

	Product.findById(req.params.id, function (err, data) {
		var file = './public/upload/' + data.img;
		var fs = require('fs');
		fs.unlink(file, function (e) {
			if (e) throw e;
		});
		data.remove(function () {
			req.flash('success_msg', 'Đã Xoá Thành Công Sản Phẩm');
			res.redirect('/admin/san-pham/qly-san-pham');
		})
	});

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