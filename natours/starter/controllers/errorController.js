const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/appError');

const sendError = (res, err, additionalInfo) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...additionalInfo,
  });
};

const sendSimpleError = (res, err) => {
  console.error('/controllers/errorController.js: ERROR!', err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;

  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. Errors: ${errors.join('. ')}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendError(res, err, { error: err, stack: err.stack });
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    // sendError: operational error that we trust
    // sendSimpleError: unknown error --> don't leave details to the client
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    error.isOperational ? sendError(res, error) : sendSimpleError(res, error);
  }

  next();
};
