var express = require('express');
var router = express.Router();

var Cart = require('../model/Cart.js');
var Product = require('../model/Product.js');


router.get('/', checkAdmin, function (req, res, next) {
	res.redirect('/admin/don-hang/danh-sach');
});

router.get('/danh-sach-cho-giao-hang', checkAdmin, function (req, res, next) {
	Cart.find().then(function (data) {
		res.render('admin/cart/delivering', {
			data: data
		});
	});

});

router.get('/danh-sach-cho-thanh-toan', checkAdmin, function (req, res, next) {
	Cart.find().then(function (data) {
		res.render('admin/cart/checkouting', {
			data: data
		});
	});

});

router.get('/danh-sach-da-xu-ly', checkAdmin, function (req, res, next) {
	Cart.find().then(function (data) {
		res.render('admin/cart/actived', {
			data: data
		});
	});

});

router.get('/:id/giao-hang', checkAdmin, function (req, res, next) {
	var id = req.params.id;
	Cart.findById(id, function (err, data) {
		data.st = 1;
		data.save();
		req.flash('success_msg', 'Đã giao hàng thành công ! Đơn hàng này sẽ chuyển về trạng thái chờ thanh toán !');
		res.redirect('back');
	});
});

router.get('/:id/thanh-toan', checkAdmin, function (req, res, next) {
	var id = req.params.id;
	Cart.findById(id).then(function (data) {
		var cart = data.cart;
		cart.forEach((item) => {
			var proId = item.item._id;
			console.log(proId);
			Product.findById(proId).then(function (pro){
				pro.quantity = pro.quantity - item.soluong;
				pro.save();
				data.st = 2;
				data.save();
				req.flash('success_msg', 'Đã thanh toán thành công ! Đơn hàng này sẽ chuyển về trạng thái đã xử lý !');
				res.redirect('back');
				
			});
		})
	})
});


router.get('/:id/xoa', checkAdmin, function (req, res, next) {
	var id = req.params.id;
	Cart.findOneAndRemove({
		_id: id
	}, function (err, offer) {
		req.flash('success_msg', 'Đã xóa thành công đơn hàng !');
		res.redirect('back');
	});
});

function checkAdmin(req, res, next) {

	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/admin');
	}
}



module.exports = router;