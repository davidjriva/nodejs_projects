const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const sendResponse = require('../utils/sendResponse');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getReviews = catchAsync(async (req, res, next) => {
  // Filter applies to requests with a tour ID to only get that tour's reviews, otherwise it gets all the reviews in the collection
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  const reviews = await Review.find(filter);

  sendResponse(res, StatusCodes.OK, { reviews, results: reviews.length });
});

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
