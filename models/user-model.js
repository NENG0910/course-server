const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "instructor"], //admin僅建立一次，管理者帳號建立後即刪除admin
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

//mongoose middleware
//hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
}); //在save之前預先做bcrypt

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err.isMatch); //isMatch = true or flase
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
