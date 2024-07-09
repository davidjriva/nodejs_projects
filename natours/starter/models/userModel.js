const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [50, "A user's name may only have a maximum of 50 characters"],
    minlength: [1, "A user's name must have a minimum of 1 characters"],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "The entered passwords don't match",
    },
  },
});

// Password encryption middleware
userSchema.pre('save', async function (next) {
  // Only run the function if the password field was modified
  if (!this.isModified('password')) return next();

  // Store password as encrypted hash with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmed password [avoid persisting in DB]
  this.passwordConfirm = undefined;
});

// Instance method: A method available on all documents that allows us to validate passwords on login
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
