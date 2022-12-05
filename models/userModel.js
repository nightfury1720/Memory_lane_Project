const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have a name "],
  },

  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    minlength: 8,
    required: [true, "User must have a password "],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password "],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match",
    },
  },

  role: {
    type: String,
    enum: ["admin", "user", "guest"],
    default: "user",
  },

  blacklisted: {
    type: Boolean,
    default: false,
  },

  blacklistedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  verified: {
    type: Boolean,
    default: false,
  },

  signUpToken: String,
  signUpTokenExpires: Date,

  passwordChangedTime: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 15);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createSignUpToken = function () {
  const signToken = crypto.randomBytes(32).toString("hex");

  this.signUpToken = crypto
    .createHash("sha256")
    .update(signToken)
    .digest("hex");

  // console.log(signToken);
  // console.log(this.signUpToken);

  this.signUpTokenExpires = Date.now() + 10 * 60 * 1000;

  return signToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
