var express = require('express');
var Admin = require('../models/Admin');
var AdminPodcast = require('../models/AdminPodcast');
var User = require('../models/User');
var UserPodcast = require('../models/UserPodcast');
var router = express.Router();

/* GET home page. */

router.get('/', (req, res, next) => {
  res.render('index');
})

router.get('/home', (req, res, next) => {
  if(req.admin){
    AdminPodcast.find({}, (err, adminPodcasts) => {
      if(err){
        return next(err);
      }
      UserPodcast.find({isVerified: true}, (err, userPodcasts) => {
        if(err){
          return next(err);
        }
        return res.render('home', { adminPodcasts, userPodcasts });
      })
    })
  }else if(req.user && req.user.userType === "free"){
    AdminPodcast.find({podcastType: "free"}, (err, adminPodcasts) => {
      if(err){
        return next(err);
      }
      UserPodcast.find({isVerified: true}, (err, userPodcasts) => {
        if(err){
          return next(err);
        }
        return res.render('home', { adminPodcasts, userPodcasts });
      })
    })
  }else if(req.user && req.user.userType === "vip"){
    AdminPodcast.find({$or: [{podcastType: "free"}, {podcastType: "vip"}]}, (err, adminPodcasts) => {
      if(err){
        return next(err);
      }
      UserPodcast.find({isVerified: true}, (err, userPodcasts) => {
        if(err){
          return next(err);
        }
        return res.render('home', { adminPodcasts, userPodcasts });
      })
    })
  }else if(req.user && req.user.userType === "premium"){
    AdminPodcast.find({}, (err, adminPodcasts) => {
      if(err){
        return next(err);
      }
      UserPodcast.find({isVerified: true}, (err, userPodcasts) => {
        if(err){
          return next(err);
        }
        return res.render('home', { adminPodcasts, userPodcasts });
      })
    })
  }else{
    res.redirect('/users/login');
  }
})

module.exports = router;
