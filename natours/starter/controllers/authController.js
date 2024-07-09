const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const { formatResponse } = require('../utils/formatResponse');
const User = require('./../models/userModel');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  formatResponse(res, StatusCodes.CREATED, newUser);
});
