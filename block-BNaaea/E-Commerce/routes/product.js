var express = require('express');
const Cart = require('../models/cart');
var Product = require('../models/product');
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

router.get('/new', (req, res, next) => {
  res.render('createProduct');
})

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if(err){
      return next(err);
    }
    res.render('productDetails', { product });
  })
})

router.post('/', (req, res, next) => {
  req.body.adminId = req.admin.id;
  req.body.category = req.body.category.split(' ');
  Product.create(req.body, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin/dashboard');
  })
})

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if(err){
      return next(err);
    }
    res.render('editProduct', { product });
  })
})

router.post('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, updatedProduct) => {
    if(err){
      return next(err);
    }
    res.redirect('/admin/dashboard');
  })
});

router.get('/:id/delete', (req, res, next) => {
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

module.exports = router;