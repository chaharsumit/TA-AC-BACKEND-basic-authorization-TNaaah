let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let cartSchema = new Schema({
  products: [{ type: Schema.Types.ObjectId, ref: "Product", unique: true }],
  user: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });


let Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;