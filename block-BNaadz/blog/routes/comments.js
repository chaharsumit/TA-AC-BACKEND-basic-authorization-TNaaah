let express = require('express');
let Comment = require('../models/comment');
let auth = require('../middlewares/auth');
const { route } = require('.');

let router = express.Router();

router.get('/new', (req, res, next) => {
  res.render('index');
})

router.get('/:id/like', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, comment) => {
    if(err){
      return next(err);   
    }
    res.redirect('/articles/' + comment.articleId);
  })
})


router.get('/:id/dislike', auth.UserLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {dislikes: 1}}, (err, comment) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + comment.articleId);
  })
})

module.exports = router;