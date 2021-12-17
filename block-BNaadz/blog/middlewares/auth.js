module.exports = {
  UserLoggedIn: (req, res, next) => {
    if(req.session && req.session.userId){
      next();
    }else{
      req.flash('error', "You haven't logged in yet, Please login to continue!!");
      res.redirect("/users/login");
    }
  },
}