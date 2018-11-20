var express = require('express');
var router = express.Router();

var Cart = require('../model/Cart.js');


router.get('/', checkAdmin, function(req, res, next) {
  res.redirect('/admin/don-hang/danh-sach');
});

router.get('/danh-sach', checkAdmin, function(req, res, next) {
	Cart.find().then(function(data){
		 res.render('admin/cart/list-bill', {data: data});
	});
  
});

router.get('/:id/xu-ly',checkAdmin, function(req, res, next) {
 	var id = req.params.id;
 	Cart.findById(id, function(err, data){
 		data.st = 1;
 		data.save();
 		req.flash('success_msg', 'Đã Xử Lý Thành Công');
		res.redirect('/admin/don-hang/danh-sach'); 
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