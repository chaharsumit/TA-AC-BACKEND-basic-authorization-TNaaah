let express = require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const AdminPodcast = require('../models/AdminPodcast');
const UserPodcast = require('../models/UserPodcast');
const auth = require('../middlewares/auth');

let router = express.Router();


router.get('/:id/new', (req, res, next) => {
  let id = req.params.id;
  if(req.user){
    User.findById(id, (err, user) => {
      if(err){
        return next(err);
      }
      return res.render('createPodcast', { user });
    })
  }
  if(req.admin){
    Admin.findById(id, (err, admin) => {
      if(err){
        return next(err);
      }
      return res.render('createPodcast', { admin });
    })
  }
});

router.post('/:id/new', (req, res, next) => {
  let id = req.params.id;
  req.body.author = id;
  if(req.user){
    req.body.podcastType = "free";
    UserPodcast.create(req.body, (err, podcast) => {
      if(err){
        return next(err);
      }
      return res.redirect('/users');
    });
  }else if(req.admin){
    AdminPodcast.create(req.body, (err, podcast) => {
      if(err){
        return next(err);
      }
      return res.redirect('/admin');
    })
  }
})

router.get('/:id/verify', (req, res, next) => {
  let id = req.params.id;
  UserPodcast.findByIdAndUpdate(id, {isVerified: true}, (err, podcast) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin');
  })
})

router.get('/:id/remove', (req, res, next) => {
  let id = req.params.id;
  UserPodcast.findByIdAndDelete(id, (err, deletedPodcast) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin');
  })
})

router.get('/admin/:id/edit', auth.AdminLoggedIn, (req, res, next) => {
  let id = req.params.id;
  AdminPodcast.findById(id, (err, podcast) => {
    if(err){
      return next(err);
    } 
    if(podcast.author.toString() === req.admin.id){
      return res.render('editPodcast', { podcast });
    }else{
      req.flash("error", "You are not the podcast owner login with the account that owns the podcast");
      res.redirect('/admin/login');
    }
  })
})

router.post('/admin/:id/edit', auth.AdminLoggedIn, (req, res, next) => {
  let id = req.params.id;
  AdminPodcast.findByIdAndUpdate(id, req.body, (err, podcast) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin');
  });
})

router.get('/admin/:id/delete', auth.AdminLoggedIn, (req, res, next) => {
  let id = req.params.id;
  AdminPodcast.findByIdAndDelete(id, (err, deletedPodcast) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin');
  })
})

router.get('/users/:id/edit', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  UserPodcast.findById(id, (err, podcast) => {
    if(err){
      return next(err);
    } 
    if(podcast.author.toString() === req.user.id){
      return res.render('editPodcast', { podcast });
    }else{
      req.flash("error", "You are not the podcast owner login with the account that owns the podcast");
      res.redirect('/users/login');
    }
  })
})

router.post('/users/:id/edit', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  UserPodcast.findByIdAndUpdate(id, req.body, (err, podcast) => {
    if(err){
      return next(err);
    }
    res.redirect('/users');
  });
})

router.get('/users/:id/delete', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  UserPodcast.findByIdAndDelete(id, (err, deletedPodcast) => {
    if(err){
      return next(err);
    }
    res.redirect('/users');
  })
})

module.exports = router;