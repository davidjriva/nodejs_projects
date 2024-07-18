const { promisify } = require('util');
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
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);

  sendResponse(res, StatusCodes.CREATED, { newUser, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1.) Verify email & password exist
  if (!email || !password) {
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

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token from request and check if it is valid
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extracts JWT from the request (i.e. "<authorization, Bearer example-token-value>")
  }

  if (!token) {
    return next(
      new AppError('No JWT token was sent with the HTTPS request. Please login first to get access to protected routes.', StatusCodes.UNAUTHORIZED)
    );
  }

  // 2. Validate the JWT token [Verification]
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user attempting to access route still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('No user with a matching ID was located for that JWT.', StatusCodes.UNAUTHORIZED));
  }

  // 4. Check if user changed password after JWT was issued
  const userChangedPassword = user.changedPasswordAfter(decoded.iat);
  if (userChangedPassword) {
    return next(new AppError('Password was changed after JWT token was issued. Please login again.', StatusCodes.UNAUTHORIZED));
  }

  // 5. Grant access to protected route
  req.user = user;
  next();
});
