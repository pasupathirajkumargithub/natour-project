const crypto = require('crypto');
const validator = require('validator');
const slugify = require('slugify');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { use } = require('../App');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose.connect(DB);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Your name must be Provided to us..:)'],
    minlength: [3, 'A name must have atleast above 3 character...;)'],
  },
  mail: {
    type: String,
    unique: true,
    lowerCase: true,
    required: [true, 'A user must have a mail...!'],
    validate: [validator.isEmail],
  },

  photo: { type: String, default: 'default.jpg' },

  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'give the role as: user, guide, Lead-guide, admin',
    },
    default: 'guide',
  },

  password: {
    type: String,
    required: [true, 'A user must have a Password...!'],
    minlength: [8, 'Password must have atleast 8 character...!'],
    Select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a ConfirmPassword...!'],
    minlength: [8, 'Password must have atleast 8 character...!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not same..!',
    },
  },

  passwordResetToken: String,

  passwordResetExpires: Date,

  passwordChangedAt: Date,

  active: { type: Boolean, default: true, select: false },
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
