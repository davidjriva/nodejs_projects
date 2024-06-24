const Tour = require('./../models/tourModel');

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
    // 1. Build Query
    // Filtering)
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((field) => delete queryObj[field]);

    // Advanced Filtering)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // Turn operators to Mongo operators (gte --> $gte)

    let query = Tour.find(JSON.parse(queryStr));

    // 2. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.replaceAll(',', ' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3. Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.replaceAll(',', ' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // excludes unnecessary fields from response
    }

    // 4. Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skipVal = (page - 1) * limit;
    query = query.skip(skipVal).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skipVal >= numTours || skipVal < 0) throw new Error('This page does not exist');
    }

    // 5. Execute Query
    const tours = await query;

    // 6. Send Response
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
