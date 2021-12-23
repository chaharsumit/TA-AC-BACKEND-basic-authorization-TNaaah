let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let adminSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passowrd: { type: String, required: true, minlength: 4 },
  adminPodcasts: [{ type: Schema.Types.ObjectId, ref: "Podcast" }]
}, { timestamps: true });

adminSchema.pre("save", function(next){
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

adminSchema.methods.verifyPassword = function(password, cb){
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  })
}

let Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;