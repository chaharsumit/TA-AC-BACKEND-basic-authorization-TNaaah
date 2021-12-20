let User = require('../models/user');
let Admin = require('../models/admin');

module.exports = {
  userLoggedIn: (req, res, next) => {
    if(req.session && req.session.userId){
      next();
    }else{
      req.flash('error', "You haven't logged in yet, Please login to continue!!");
      res.redirect("/users/user/login");
    }
  },
  adminLoggedIn: (req, res, next) => {
    if(req.session && req.session.adminId){
      next();
    }else{
      req.flash('error', "You haven't logged in as admin, Please login as admin to continue!!");
      res.redirect("/users/admin/login");
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if(userId){
      User.findById(userId, "userName email",(err, user) => {
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
      next();
    }
  },
  adminInfo: (req, res, next) => {
    var adminId = req.session && req.session.adminId;
    if(adminId){
      Admin.findById(adminId, "adminName email",(err, admin) => {
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
      next();
    }
  }
}