let express = require('express');
let Admin = require('../models/Admin');
let router = express.Router();


router.get('/', (req, res, next) => {
  Admin.findById(req.admin.id, (err, admin) => {
    if(err){
      return next(err);
    }
    res.render('adminDashboard', { admin });
  })
})

router.get('/register', (req, res, next) => {
  res.render('adminRegister');
})

router.post('/', (req, res, next) => {
  Admin.create(req.body, (err, admin) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin');
  });
})

router.get('/login', (req, res, next) => {
  res.render('adminLogin');
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    req.flash("error", "Email/password Required");
    return res.redirect('/admin/login');
  }
  Admin.findOne({ email: email }, (err, admin) => {
    if(err){
      return next(err);
    }
    if(!admin){
      req.flash('error', "admin not found!! Kindly register first");
      return res.redirect('/admin/register');
    }
    admin.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash("error", "Incorrect Password");
        return res.redirect('/admin/login');
      }
      req.session.adminId = admin.id;
      res.redirect('/admin');
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect('/');
})

module.exports = router;