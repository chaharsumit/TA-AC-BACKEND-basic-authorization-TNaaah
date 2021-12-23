let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 4 },
  userPodcasts: [{ type: Schema.Types.ObjectId, ref: "Podcast" }],
  type: String
}, { timestamps: true });

userSchema.pre("save", function(next){
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

userSchema.methods.verifyPassword = function(password, cb){
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  })
}

let User = mongoose.model('User', userSchema);

module.exports = User;