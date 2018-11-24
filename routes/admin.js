var express = require('express');
var router = express.Router();

var Cart = require('../model/Cart.js');
var Cate = require('../model/Cate.js');

var Staff = require('../model/Staff.js');

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/', function (req, res, next) {
  res.render('admin/login/login');
});

/* GET home page. */
router.get('/trang-chu', checkAdmin, function (req, res, next) {
  Cart.find({
    st: 2,
  }).then(function (data) {
    var arr = [];
    var tongtien = 0;
    data.forEach(function (temp1) {
      var cart = temp1.cart;
      cart.forEach(function (temp2) {
        var tien = temp2.tien;
        tongtien += tien;
        var sl = temp2.soluong;
        var id = temp2.item.cateId;
        arr.push({
          id,
          sl,
          tien
        });
      })
    })
    console.log(arr);
    Cate.find({}).then(function (cate) {
      res.render('admin/main/index', {
        tongtien: tongtien,
        arr: arr,
        cart: data,
        cate: cate,
      });
    })
  });
});
router.post('/',
  passport.authenticate('local', {
    successRedirect: '/admin/trang-chu',
    failureRedirect: '/admin',
    failureFlash: true
  })
);

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },

  function (username, password, done) {
    Staff.findOne({
      username: username
    }, function (err, username) {
      if (err) throw err;
      if (username) {
        bcrypt.compare(password, username.password, function (err, staff) {
          if (err) throw err;
          if (staff) {
            return done(null, username);
          } else {
            return done(null, false, {
              message: 'Tài Khoảng Không Đúng'
            });
          }
        });
      } else {
        return done(null, false, {
          message: 'Tài Khoảng Không Đúng'
        });
      }
    });
  }

));

passport.serializeUser(function (username, done) {
  done(null, username.id);
});

passport.deserializeUser(function (id, done) {
  Staff.findById(id, function (err, username) {
    done(err, username);
  });
});



router.post('/getStaff', checkAdmin, function (req, res) {
  res.json(req.user);
});

router.get('/dang-xuat', checkAdmin, function (req, res) {
  res.render('admin/login/login');
});

router.post('/dang-xuat', checkAdmin, function (req, res) {
  req.logout();
  res.redirect('/admin');
});


function checkAdmin(req, res, next) {

  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/admin');
  }
}

module.exports = router;