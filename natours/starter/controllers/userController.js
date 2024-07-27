const fs = require('fs');
const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/sendResponse');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

const dataFilePath = `${__dirname}/../dev-data/data`;
const users = JSON.parse(fs.readFileSync(`${dataFilePath}/users.json`));

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

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  sendResponse(res, StatusCodes.OK, { users, results: users.length });
});

exports.createUser = (req, res) => {
  res.status(500).json({ status: 'failed', data: 'Route not yet defined' });
};

exports.getUser = (req, res) => {
  const id = req.params['id'];
  const user = users.find((user) => user._id == id);

  if (!user) {
    res.status(404).json({ status: 'failed', message: 'invalid ID' });
    return;
  }

  res.status(200).json({ status: 'success', data: { user } });
};

exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'failed', message: 'Route not yet defined' });
};

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

exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'failed', message: 'Route not yet defined' });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  sendResponse(res, StatusCodes.NO_CONTENT);
});
