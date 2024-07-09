const fs = require('fs');
const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const formatResponse = require('../utils/formatResponse');
const User = require('./../models/userModel');

const dataFilePath = `${__dirname}/../dev-data/data`;
const users = JSON.parse(fs.readFileSync(`${dataFilePath}/users.json`));

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  formatResponse(res, StatusCodes.OK, { users, results: users.length });
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

exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'failed', message: 'Route not yet defined' });
};
