const { StatusCodes } = require('http-status-codes');
const path = require('path');

const Tour = require(path.join(__dirname, '../models/tourModel'));
const User = require(path.join(__dirname, '../models/userModel'));
const catchAsync = require(path.join(__dirname, '../utils/catchAsync'));
const AppError = require(path.join(__dirname, '../utils/appError'));

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(StatusCodes.OK).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', StatusCodes.NOT_FOUND));
  }

  res.status(StatusCodes.OK).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(StatusCodes.OK).render('login', {
    title: 'Log Into Your Account',
  });
};

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(StatusCodes.OK).render('account', {
    title: 'Your Account',
  });
});
