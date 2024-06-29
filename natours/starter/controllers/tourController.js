const { StatusCodes } = require('http-status-codes');
const { formatResponse } = require('../utils/formatResponse');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

// Middleware: displays top 5 cheapest tours
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Get all documents in the tours collection from MongoDB
const getTours = catchAsync(async (req, res) => {
  // BUILD QUERY
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

  // EXECUTE QUERY
  const tours = await features.query;

  // SEND RESPONSE
  formatResponse(res, StatusCodes.OK, { tours, results: tours.length });
});

const getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  formatResponse(res, StatusCodes.OK, tour);
});

// Create new MongoDB document with tour information & insert into MongoDB
const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  formatResponse(res, StatusCodes.CREATED, newTour);
});

const updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  formatResponse(res, StatusCodes.OK, tour);
});

const deleteTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);

  formatResponse(res, StatusCodes.OK, null);
});

const getTourStats = catchAsync(async (req, res) => {
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

  formatResponse(res, StatusCodes.OK, stats);
});

// Uses an aggregation pipeline to calculate the number of tours per month for a specific year
// Returns the number of tours per month sorted in descending order
const getMonthlyPlan = catchAsync(async (req, res) => {
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

  formatResponse(res, StatusCodes.OK, plan);
});

module.exports = { aliasTopTours, getTours, getTour, createTour, updateTour, deleteTour, getTourStats, getMonthlyPlan };
