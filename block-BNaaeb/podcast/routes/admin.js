let express = require('express');
let Admin = require('../models/Admin');
let router = express.Router();

app.get('/', (req, res, next) => { 
  res.render('adminDashboard');
})

app.get('/register', (req, res, next) => {
  res.render('adminRegister');
})

app.post('/', (req, res, next) => {
  Admin.create(req.body, (err, admin) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin');
  });
})

app.get('/login', (req, res, next) => {
  res.render('/adminLogin');
})

app.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    req.flash("error", "Email/password Required");
  }
})

module.exports = router;