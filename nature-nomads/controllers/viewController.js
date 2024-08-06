const { StatusCodes } = require('http-status-codes');
const path = require('path');

const Tour = require(path.join(__dirname, '../models/tourModel'));
const catchAsync = require(path.join(__dirname, '../utils/catchAsync'));

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
