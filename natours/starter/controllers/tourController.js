const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

// Create new MongoDB document with tour information & insert into MongoDB
const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(500).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

module.exports = { aliasTopTours, getTours, getTour, createTour, updateTour, deleteTour };
