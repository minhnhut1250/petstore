var express = require('express');
var router = express.Router();
var _ = require('lodash');

var Cart = require('../model/Cart.js');
var Cate = require('../model/Cate.js');

var User = require('../model/User.js');

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/', function (req, res, next) {
  res.render('admin/login/login');
});

/* GET home page. */
router.get('/trang-chu', checkAdmin, function (req, res, next) {
  Cate.find().then(function (cate) {
    Cart.find({
      st: 2
    }).then(function (data) {
      var tongtien = 0;
      for (var i = 0; i < data.length; i++) {
        var cart = data[i].cart;
        for ( var j = 0; j < cart.length; j++) {
          var tien = cart[j].tien;
          tongtien += tien;
          var item = cart[j].item;
          var id = item._id;
          var loaisp = item.cateId;
          var item = {};
          item[id] = loaisp;
          var a =_.countBy(item, (e) => e[Object.keys(e)[0]] === loaisp );
          console.log(a.true);
        }
      }
      res.render('admin/main/index', {
        tongtien: tongtien,
        cart: data,
        cate: cate,
      });
    })
  })
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
    User.findOne({
      username: username
    }, function (err, username) {
      if (err) throw err;
      if (username) {
        bcrypt.compare(password, username.password, function (err, user) {
          if (err) throw err;
          if (user) {
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
  User.findById(id, function (err, username) {
    done(err, username);
  });
});



router.post('/getUser', checkAdmin, function (req, res) {
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