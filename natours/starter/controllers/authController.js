const { promisify } = require('util');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array (i.e. ['admin', 'lead-guide']). role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', StatusCodes.FORBIDDEN));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    sendResponse(res, StatusCodes.OK, { message: 'Token sent to email!' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!'), 500);
  }
});

exports.resetPassword = (req, res, next) => {
  // 1.) Get user based on the token
  

  // 2.) Set the new password [if token is still valid and user exists]

  // 3.) Update user document with changed password and changedPasswordAt property

  // 4.) Login the user with new JWT

};
