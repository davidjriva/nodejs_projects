const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  sendResponse(res, StatusCodes.CREATED, { newUser, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1.) Verify email & password exist
  if (!email | !password) {
    next(new AppError('Please provide email and password', StatusCodes.BAD_REQUEST));
  }

  // 2.) Check if user exists & if password is correct
  const user = await User.findOne({ email }).select('+password');

  // 3.) If everything is valid, then respond with the JWT [JSON Web Token]
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('The provided email or password is incorrect', StatusCodes.UNAUTHORIZED));
  }

  const token = signToken(user._id);
  sendResponse(res, StatusCodes.OK, token);
});
