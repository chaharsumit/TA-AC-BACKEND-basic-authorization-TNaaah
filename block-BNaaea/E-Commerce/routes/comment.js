let express = require('express');
let User = require('../models/user');
let Product = require('../models/product');
let Comment = require('../models/comment');
let auth = require('../middlewares/auth');
let router = express.Router();

router.get('/:id/like', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, comment) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + comment.productId);
  })
})

router.get('/:id/edit', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if(err){
      return next(err);
    }
    if(comment.user === req.session.userId){
      return res.render('editComment', { comment });
    }else{
      req.flash("error", "You must be the author of the comment to edit or delete it");
      res.redirect('/products/' + id);
    }
  })
})

router.post('/:id', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + comment.productId);
  })
})

router.get('/:id/dislike', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {dislikes: 1}}, (err, comment) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + comment.productId);
  })
})

router.get('/:id/delete', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, deletedComment) => {
    if(err){
      return next(err);
    }
    Product.findByIdAndUpdate(deletedComment.productId, {$pull: {comments: deletedComment.id}}, (err, product) => {
      if(err){
        return next(err);
      }
      console.log(product);
      res.redirect('/products/' + product.id);
    })
  })
})

module.exports = router;