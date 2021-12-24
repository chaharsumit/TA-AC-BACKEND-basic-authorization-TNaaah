var express = require('express');
var User = require('../models/User');
const UserPodcast = require('../models/UserPodcast');
var router = express.Router();

/* GET users listing. */

router.get('/', (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if(err){
      return next(err);
    }
    UserPodcast.find({author: user.id}, (err, userPodcasts) => {
      if(err){
        return next(err);
      }
      res.render('userDashboard', { user, userPodcasts });
    })
  })
})

router.get('/register', (req, res) => {
  res.render('userRegister');
})

router.post('/', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
})

router.get('/login', (req, res, next) => {
  res.render('userLogin');
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    req.flash("error", "Email/password Required");
    return res.redirect('/users/login');
  }
  User.findOne({ email: email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      req.flash('error', "user not found!! Kindly register first");
      return res.redirect('/users/register');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash("error", "Incorrect Password");
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users');
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect('/');
})

module.exports = router;