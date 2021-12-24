let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userPodcastSchema = new Schema({
  title: String,
  description: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  podcastType: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

let UserPodcast = mongoose.model('UserPodcast', userPodcastSchema);

module.exports = UserPodcast;