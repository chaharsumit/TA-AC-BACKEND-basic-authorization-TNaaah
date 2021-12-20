var express = require('express');
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
    req.flash("error", "Email/Password required");
    return res.redirect('/users/login');
  }
  User.find({ email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      req.flash("error", "User not found kindly register first");
      return res.redirect('/users/register');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash("error", "Password incorrect");
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/');
    })
  })
})

module.exports = router;