const { StatusCodes } = require('http-status-codes');
const path = require('path');

const Tour = require(path.join(__dirname, '../models/tourModel'));
const catchAsync = require(path.join(__dirname, '../utils/catchAsync'));

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1.) Get all tour data from collection
  const tours = await Tour.find();

  // 2.) Build template

  // 3.) Render the template using the tour data from step 1
  res.status(StatusCodes.OK).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1.) Get tour data, for the requested tour (including reviews and guides)
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2.) Build template
  // console.log(tour);
  // 3.) Render template using data from step 1
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
