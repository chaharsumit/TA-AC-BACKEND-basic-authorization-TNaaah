let express = require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const AdminPodcast = require('../models/AdminPodcast');
const UserPodcast = require('../models/UserPodcast');

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

module.exports = router;