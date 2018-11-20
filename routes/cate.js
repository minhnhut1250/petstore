var express = require('express');
var router = express.Router();

var Cate = require('../model/Cate.js');
var Product = require('../model/Product.js');

/* GET home page. */
router.get('/', checkAdmin, function (req, res, next) {
	res.redirect('/admin/loai-san-pham/qly-loai-san-pham');
});

router.get('/qly-loai-san-pham', checkAdmin, function (req, res) {
	Cate.find().then(function (data) {
		res.render('admin/cate/view', {
			errors: null,
			cate: data
		});
	});
});

router.post('/qly-loai-san-pham', checkAdmin, function (req, res, next) {
	//res.render('admin/cate/them');
	req.checkBody('name', 'Giá Trị không được rổng').notEmpty();
	req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({
		min: 3,
		max: 32
	});
	var errors = req.validationErrors();

	if (errors) {
		Cate.find().then(function (data) {
			res.render('admin/cate/view', {
				errors: errors,
				cate: data
			});
		});
	} else {
		var cate = new Cate({
			name: req.body.name,
		});
		cate.save().then(function () {
			req.flash('success_msg', 'Đã Thêm Thành Công Loại Sản Phẩm ');
			res.redirect('/admin/loai-san-pham/qly-loai-san-pham');
		});
	}
});


// router.get('/qly-loai-san-pham/:id/sua', checkAdmin, function (req, res, next) {
// 	Cate.findById(req.params.id, function (err, data) {
// 		res.render('admin/cate/edit', {
// 			errors: null,
// 			data: data
// 		});
// 	});
// });

router.post('/qly-loai-san-pham/sua', checkAdmin, function (req, res, next) {
	req.checkBody('name', 'Giá Trị không được rổng').notEmpty();
	req.checkBody('name', 'Name 5 đến 32 ký tự').isLength({
		min: 3,
		max: 32
	});
	var id = req.body.id;
	console.log(id);
	var errors = req.validationErrors();
	if (errors) {
		Cate.findById(id, function (err, data) {
			res.render('admin/cate/sua', {
				errors: errors,
				data: data
			});
		});
	} else {
		Cate.findById(id, function (err, data) {
			data.name = req.body.name;
			data.save();
			req.flash('success_msg', 'Đã Sửa Thành Công Loại Sản Phẩm ');
			res.redirect('/admin/loai-san-pham/qly-loai-san-pham');
		});
	}

});

router.get('/qly-loai-san-pham/:id/xoa', checkAdmin, function (req, res, next) {
	var id = req.params.id
	// Cate.findById(id).remove(function () {
	// 	req.flash('success_msg', 'Đã Xoá Thành Công Loại Sản Phẩm ');
	// 	res.redirect('/admin/loai-san-pham/qly-loai-san-pham');
	// });
	Cate.findById(id, function (err, data) {
		Product.findOne({cateId: data._id }, function (err, pro) {
			if (pro != null) {
				req.flash('error_msg', 'Danh mục có sản phẩm nên không thể xóa');
				res.redirect('/admin/loai-san-pham/qly-loai-san-pham');
			} else {
				data.remove(function () {
					req.flash('success_msg', 'Đã Xoá Thành Công Sản Phẩm');
					res.redirect('/admin/loai-san-pham/qly-loai-san-pham');
				})
			}
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