let express = require('express');
let User = require('../models/user');
let Product = require('../models/product');
let Comment = require('../models/comment');
let router = express.Router();

router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, comment) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + comment.productId);
  })
})

router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {dislikes: 1}}, (err, comment) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + comment.productId);
  })
})

router.get('/:id/delete', (req, res, next) => {
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