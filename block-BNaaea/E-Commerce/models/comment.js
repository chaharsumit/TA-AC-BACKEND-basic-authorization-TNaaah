let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  comment: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
}, { timestamps: true });


let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;