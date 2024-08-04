const { StatusCodes } = require('http-status-codes');
const path = require('path');

const catchAsync = require(path.join(__dirname, '..', 'utils', 'catchAsync'));
const sendResponse = require(path.join(__dirname, '..', 'utils', 'sendResponse'));
const AppError = require(path.join(__dirname, '.', '..', 'utils', 'appError'));
const User = require(path.join(__dirname, '.', '..', 'models', 'userModel'));
const factory = require(path.join(__dirname, 'handlerFactory'));

// Only keep the fields passed in as allowed fields [prevents modifying certain fields]
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

// CRUD functionality for User resource
exports.getUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.getMe = (req, res, next) => {
  // Gets the user document for the current logged in user
  req.params.id = req.user.id;
  next();
};

exports.updateUser = factory.updateOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1.) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('Please use the proper routes </updatePassword> or </resetPassword> to modify password instead.', StatusCodes.FORBIDDEN)
    );
  }

  // 2.) Filter out unwanted field names not allowed to be modified by a user
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3.) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  sendResponse(res, StatusCodes.OK, updatedUser);
});

exports.deleteUser = factory.deleteOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  sendResponse(res, StatusCodes.NO_CONTENT);
});
