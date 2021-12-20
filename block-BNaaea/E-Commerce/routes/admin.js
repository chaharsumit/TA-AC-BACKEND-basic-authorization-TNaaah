var express = require('express');
var User = require('../models/user');
var Admin = require('../models/admin');
var Product = require('../models/product');
var auth = require('../middlewares/auth');
var router = express.Router();

/* GET users listing. */

router.get('/', (req, res, next) => {
  res.render('admin');
})

router.get('/dashboard', (req, res, next) => {
  Product.find({}, (err, products) => {
    if(err){
      return next(err);
    }
    res.render('dashboard', { products });
  })
})

router.get('/login', (req, res, next) => {
  let error = req.flash("error");
  res.render('adminLogin', { error });
})


router.get('/register', (req, res, next) => {
  let error = req.flash("error");
  res.render('adminRegister', { error });
}) 

router.post('/', (req, res, next) => {
  Admin.create(req.body, (err, admin) => {
    if(err){
      return next(err);
    }
    res.redirect('/');
  })
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    req.flash("error", "Email/Password required");
    return res.redirect('/admin/login');
  }
  Admin.findOne({ email }, (err, admin) => {
    if(err){
      return next(err);
    }
    if(!admin){
      req.flash("error", "admin not found kindly register first");
      return res.redirect('/admin/register');
    }
    admin.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash("error", "Password incorrect");
        return res.redirect('/admin/login');
      }
      req.session.adminId = admin.id;
      res.redirect('/admin/dashboard');
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect('/');
})

module.exports = router;