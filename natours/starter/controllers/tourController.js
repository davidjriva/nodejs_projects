const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const formatResponse = (res, statusCode, status, data) => {
  const response = {
    status,
  };

  if (data) {
    // Transmit data
    response.data = data;
  } else {
    // Send error message
    response.message = getReasonPhrase(statusCode);
  }

  res.status(statusCode).json(response);
};

// Middleware: displays top 5 cheapest tours
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Get all documents in the tours collection from MongoDB
const getTours = async (req, res) => {
  try {
    // BUILD QUERY
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

    // EXECUTE QUERY
    const tours = await features.query;

    // SEND RESPONSE
    formatResponse(res, StatusCodes.OK, 'success', { tours, results: tours.length });
  } catch (err) {
    formatResponse(res, StatusCodes.BAD_REQUEST, 'failed', null);
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    formatResponse(res, StatusCodes.OK, 'success', tour);
  } catch (err) {
    formatResponse(res, StatusCodes.BAD_REQUEST, 'failed', null);
  }
};

// Create new MongoDB document with tour information & insert into MongoDB
const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    formatResponse(res, StatusCodes.CREATED, 'success', newTour);
  } catch (err) {
    formatResponse(res, StatusCodes.BAD_REQUEST, 'failed', null);
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    formatResponse(res, StatusCodes.OK, 'success', tour);
  } catch (err) {
    formatResponse(res, StatusCodes.NOT_FOUND, 'failed', null);
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    formatResponse(res, StatusCodes.OK, 'success', null);
  } catch (err) {
    formatResponse(res, StatusCodes.NOT_FOUND, 'failed', null);
  }
};

const getTourStats = async (req, res) => {
  try {
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

    formatResponse(res, StatusCodes.OK, 'success', stats);
  } catch (err) {
    formatResponse(res, StatusCodes.NOT_FOUND, 'failed', null);
  }
};

// Uses an aggregation pipeline to calculate the number of tours per month for a specific year
// Returns the number of tours per month sorted in descending order
const getMonthlyPlan = async (req, res) => {
  try {
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

    formatResponse(res, StatusCodes.OK, 'success', plan);
  } catch (err) {
    formatResponse(res, StatusCodes.NOT_FOUND, 'failed', null);
  }
};

module.exports = { aliasTopTours, getTours, getTour, createTour, updateTour, deleteTour, getTourStats, getMonthlyPlan };
