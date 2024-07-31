const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const sendResponse = require('../utils/sendResponse');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// CRUD functionality for Review resource
exports.getReviews = factory.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }

  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  next();
};

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.getReview = factory.getOne(Review);
