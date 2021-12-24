let User = require('../models/User');
let Admin = require('../models/Admin');

module.exports = {
  UserLoggedIn: (req, res, next) => {
    if(req.session && req.session.userId){
      return next();
    }else{
      req.flash("error", "You must login to continue");
      res.redirect('/users/login');
    }
  },
  AdminLoggedIn: (req, res, next) => {
    if(req.session && req.session.adminId){
      return next();
    }else{
      req.flash("error", "You must login to continue");
      res.redirect('/admin/login');
    }
  },
  UserInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if(userId){
      User.findById(userId, "name email userType", (err, user) => {
        if(err){
          return next(err);
        }
        req.user = user;
        res.locals.user = user;
        next();
      })
    }else{
      req.user = null;
      res.locals.user = null;
      next()
    }
  },
  AdminInfo: (req, res, next) => {
    var adminId = req.session && req.session.adminId;
    if(adminId){
      Admin.findById(adminId, "email name", (err, admin) => {
        if(err){
          return next(err);
        }
        req.admin = admin;
        res.locals.admin = admin;
        next();
      })
    }else{
      req.admin = null;
      res.locals.admin = null;
      next()
    }
  }
}