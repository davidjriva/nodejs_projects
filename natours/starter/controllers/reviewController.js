const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const sendResponse = require('../utils/sendResponse');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  sendResponse(res, StatusCodes.OK, { reviews, results: reviews.length });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  sendResponse(res, StatusCodes.CREATED, newReview);
});
