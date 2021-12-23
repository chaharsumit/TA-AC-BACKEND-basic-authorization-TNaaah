let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let podcastSchema = new Schema({
  podcastType: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

podcastSchema.pre("save", function(next){
  if(this.password && this.isModified("password")){
    bcrypt.hash(this.password, 10, (err, hashedValue) =>{
      if(err){
        return next(err);
      }
      this.password = hashedValue;
      return next();
    })
  }else{
    return next();
  }
})

podcastSchema.methods.verifyPassword = function(password, cb){
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  })
}

let Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;