var express = require('express');
var router = express.Router();

var Cart = require('../model/Cart.js');


router.get('/', checkAdmin, function(req, res, next) {
  res.redirect('/admin/don-hang/danh-sach');
});

router.get('/danh-sach-cho-giao-hang', checkAdmin, function(req, res, next) {
	Cart.find().then(function(data){
		 res.render('admin/cart/delivering', {data: data});
	});
  
});

router.get('/danh-sach-cho-thanh-toan', checkAdmin, function(req, res, next) {
	Cart.find().then(function(data){
		 res.render('admin/cart/checkouting', {data: data});
	});
  
});

router.get('/danh-sach-da-xu-ly', checkAdmin, function(req, res, next) {
	Cart.find().then(function(data){
		 res.render('admin/cart/actived', {data: data});
	});
  
});

router.get('/:id/giao-hang',checkAdmin, function(req, res, next) {
 	var id = req.params.id;
 	Cart.findById(id, function(err, data){
 		data.st = 1;
 		data.save();
 		req.flash('success_msg', 'Đã Chọn Giao Hàng Thành Công');
		res.redirect('/admin/don-hang/danh-sach-cho-thanh-toan'); 
 	});
});

router.get('/:id/thanh-toan',checkAdmin, function(req, res, next) {
	var id = req.params.id;
	Cart.findById(id, function(err, data){
		data.st = 2;
		data.save();
		req.flash('success_msg', 'Đã Thanh Toán Thành Công');
	 res.redirect('/admin/don-hang/danh-sach-da-xu-ly'); 
	});
});


router.get('/:id/xoa', checkAdmin, function(req, res, next) {
 	var id = req.params.id;
 	Cart.findOneAndRemove({_id: id}, function(err, offer){
 		req.flash('success_msg', 'Đã Xoa Thành Công');
		res.redirect('/admin/don-hang/danh-sach'); 
 	});
});

function checkAdmin(req, res, next){
   
    if(req.isAuthenticated()){
      next();
    }else{
      res.redirect('/admin');
    }
}



module.exports = router;