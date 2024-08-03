const { StatusCodes } = require('http-status-codes');

const sendResponse = require('../utils/sendResponse');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// CRUD functionality for Tour resource
exports.getTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

// Geospatial query for tours within a certain distance to the user
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radians = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  console.log(`distance:${distance}\nlat:${lat} lng:${lng}\nunit: ${unit}\nradians: ${radians}`);

  if (!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude in the format lat,lng', StatusCodes.BAD_REQUEST));
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radians],
      },
    },
  });

  sendResponse(res, StatusCodes.OK, { tours, results: tours.length });
});

// Calculates distances from a location to all other tours
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const distanceMultiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(new AppError('Please provide latitude and longitude in the format lat,lng', StatusCodes.BAD_REQUEST));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  sendResponse(res, StatusCodes.OK, { distances, results: distances.length });
});

// Additional routes for data analysis features
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  sendResponse(res, StatusCodes.OK, stats);
});

// Uses an aggregation pipeline to calculate the number of tours per month for a specific year
// Returns the number of tours per month sorted in descending order
exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = parseInt(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);

  sendResponse(res, StatusCodes.OK, plan);
});
