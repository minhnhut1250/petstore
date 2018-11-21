var express = require('express');
var router = express.Router();

var Cart = require('../model/Cart.js');
var Cate = require('../model/Cate.js');

var User = require('../model/User.js');

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



router.get('/', function (req, res, next) {
  res.render('admin/login/login');
});

function TongDoanhThu(callback) {
  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("3dwebsite");
    dbo.collection("hoadon").find().toArray(function (err, result) {
      if (err) {
        throw err;
        console.log(err);
      } else if (result.length > 0) {
        var tongket = {
          giadung: 0,
          fashion: 0,
          mebe: 0,
          thucung: 0,
          xe: 0,
          dientu: 0,
        }
        for (var i = 0; i < result.length; i++) {
          var danhsach = result[i].danhsachsanpham;
          tongket["giadung"] += parseInt(thongKe(danhsach, "giadung"));
          tongket["fashion"] += parseInt(thongKe(danhsach, "fashion"));

          tongket["thucung"] += parseInt(thongKe(danhsach, "thucung"));
          tongket["xe"] += parseInt(thongKe(danhsach, "xe"));

          tongket["dientu"] += parseInt(thongKe(danhsach, "dientu"));
          tongket["mebe"] += parseInt(thongKe(danhsach, "mebe"));
        }
        var sum = 0;
        for (var each in tongket) {
          sum += tongket[each]
        }
        var result = {
          tongSP: sum,
          tongket: tongket
        }
        callback(result);
      }
    });
    db.close();
  });
}

/* GET home page. */
router.get('/trang-chu', function (req, res, next) {
  Cart.find({
    st: 2
  }).then(function (data) {
    var tongtien = 0;
    for (var i = 0; i < data.length; i++) {
      var cart = data[i].cart;
      for (j = 0; j < cart.length; j++) {
        var tien = cart[j].tien;
        tongtien += tien;
      }
    }
    res.render('admin/main/index',{
      total:tongtien,
    });
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