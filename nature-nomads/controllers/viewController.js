const { StatusCodes } = require('http-status-codes');
const path = require('path');

const Tour = require(path.join(__dirname, '../models/tourModel'));
const catchAsync = require(path.join(__dirname, '../utils/catchAsync'));

exports.getOverview = catchAsync(async (req, res) => {
  // 1.) Get all tour data from collection
  const tours = await Tour.find();

  // 2.) Build template

  // 3.) Render the template using the tour data from step 1

  res.status(StatusCodes.OK).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = (req, res) => {
  res.status(StatusCodes.OK).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
