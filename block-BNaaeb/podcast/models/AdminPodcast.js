let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let adminPodcastSchema = new Schema({
  title: String,
  description: String,
  author: { type: Schema.Types.ObjectId, ref: "Admin" },
  podcastType: String,
}, { timestamps: true });

let AdminPodcast = mongoose.model('AdminPodcast', adminPodcastSchema);

module.exports = AdminPodcast;