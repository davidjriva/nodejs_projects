const { StatusCodes } = require('http-status-codes');

const sendResponse = require('../utils/sendResponse');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

// Middleware: displays top 5 cheapest tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Get all documents in the tours collection from MongoDB
exports.getTours = catchAsync(async (req, res) => {
  // BUILD QUERY
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

  // EXECUTE QUERY
  const tours = await features.query;

  // SEND RESPONSE
  sendResponse(res, StatusCodes.OK, { tours, results: tours.length });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError(`No tour find with the ID ${req.params.id}`, StatusCodes.NOT_FOUND));
  }

  sendResponse(res, StatusCodes.OK, tour);
});

// Create new MongoDB document with tour information & insert into MongoDB
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  sendResponse(res, StatusCodes.CREATED, newTour);
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!tour) return next(new AppError(`No tour find with the ID ${req.params.id}`, StatusCodes.NOT_FOUND));

  sendResponse(res, StatusCodes.OK, tour);
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) return next(new AppError(`No tour find with the ID ${req.params.id}`, StatusCodes.NOT_FOUND));

  sendResponse(res, StatusCodes.OK, null);
});

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
