const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const sendResponse = require('../utils/sendResponse');

exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  sendResponse(res, StatusCodes.OK, { reviews, results: reviews.length });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Handling nested routes
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }

  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  
  const newReview = await Review.create(req.body);

  sendResponse(res, StatusCodes.CREATED, newReview);
});
