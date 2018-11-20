var express = require('express');
var router = express.Router();

var Cate = require('../model/Cate.js');

var User = require('../model/User.js');

var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


/* GET home page. */
router.get('/trang-chu', checkAdmin, function(req, res, next) {
  res.render('admin/main/index');
});

router.get('/', function(req, res, next) {
  res.render('admin/login/login');
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

  function(username, password, done) {
      User.findOne({username: username}, function(err, username){
          if(err) throw err;
          if(username){
            bcrypt.compare(password, username.password, function(err, user) {
                if(err) throw err;
                if(user){
                     return done(null, username);
                }else{
                   return done(null, false, { message: 'Tài Khoảng Không Đúng' });
                }
            });
          }else{
             return done(null, false, { message: 'Tài Khoảng Không Đúng' });
          }
      });
  }

));

passport.serializeUser(function(username, done) {
  
  done(null, username.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, username) {
    done(err, username);
  });
});



router.post('/getUser',checkAdmin, function (req, res) {
    res.json(req.user);
});


router.post('/dang-xuat',checkAdmin, function (req, res) {
    req.logout();
    res.redirect('/admin');
});


function checkAdmin(req, res, next){
   
    if(req.isAuthenticated()){
      next();
    }else{
      res.redirect('/admin');
    }
}

module.exports = router;