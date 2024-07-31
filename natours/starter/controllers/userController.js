const fs = require('fs');
const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

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
