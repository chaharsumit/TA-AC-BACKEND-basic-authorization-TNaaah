var express = require('express');
const Cart = require('../models/cart');
var Product = require('../models/product');
var Comment = require('../models/comment');
var auth = require('../middlewares/auth');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find({}, (err, products) => {
    if(err){
      return next(err);
    }
    res.render('shop', { products });
  })
})

router.get('/new', auth.adminLoggedIn, (req, res, next) => {
  res.render('createProduct');
})

//Add Comment for product
router.post('/:id/comment', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  req.body.user = req.session.userId;
  req.body.productId = id;
  Comment.create(req.body, (err, comment) => {
    if(err){
      return next(err);
    }
    Product.findByIdAndUpdate(id, {$push: {comments: comment.id}}, (err, updatedProduct) => {
      if(err){
        return next(err);
      }
      res.redirect('/products/' + id);
    })
  });
})

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id).populate("comments").exec((err, product) => {
    if(err){
      return next(err);
    }
    res.render('productDetails', { product })
  })
})

router.post('/', auth.adminLoggedIn, (req, res, next) => {
  req.body.adminId = req.admin.id;
  req.body.category = req.body.category.split(' ');
  Product.create(req.body, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin/dashboard');
  })
})

router.get('/:id/edit', auth.adminLoggedIn,  (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if(err){
      return next(err);
    }
    res.render('editProduct', { product });
  })
})

router.post('/:id/edit', auth.adminLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, updatedProduct) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin/dashboard');
  })
});

router.get('/:id/delete', auth.adminLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndDelete(id, (err, deletedProduct) => {
    if(err){
      return next(err);
    }
    Cart.updateMany({$exists: {products: id}}, {$pull: {products: id}},(err, carts) => {
      if(err){
        return next(err);
      }
      res.redirect('/admin/dashboard');
    })
  })
})

//like-dislike

router.get('/:id/like', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + id);
  })
})

router.get('/:id/dislike', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc: {dislikes: 1}}, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + id);
  })
})

//quantity inc-dec

router.get('/:id/quantityInc', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc: {quantity: 1}}, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + id);
  })
})

router.get('/:id/quantityDec', auth.userLoggedIn, (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc: {quantity: -1}}, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + id);
  })
})

module.exports = router;