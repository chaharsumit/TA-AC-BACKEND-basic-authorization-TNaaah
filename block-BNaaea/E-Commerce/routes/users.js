var express = require('express');
var User = require('../models/user');
var Admin = require('../models/admin');
var auth = require('../middlewares/auth');
var router = express.Router();

/* GET users listing. */

router.get('/login', (req, res, next) => {
  let error = req.flash("error");
  res.render('userLogin', { error });
})


router.get('/register', (req, res, next) => {
  let error = req.flash("error");
  res.render('userRegister', { error });
}) 

router.post('/', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
      return next(err);
    }
    res.redirect('/');
  })
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    req.flash("error", 'Email/Password required');
    return res.redirect('/users');
  }
  User.findOne({ email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      req.flash("error", "Invalid credential kindly register if not registered yet!");
      return res.redirect('/users/register');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash("error", "Password didn't match try again!!");
        return res.redirect('/users');
      }
      req.session.userId = user.id;
      res.redirect('/');
    });
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect('/');
})

module.exports = router;
