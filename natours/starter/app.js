const { StatusCodes } = require('http-status-codes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
// Functions capable of modifying incoming request data.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //Morgan: Logging Middleware
}

app.use(express.json()); // Adds the body into the request object as JSON.

app.use(express.static(`${__dirname}/public`)); // Serve static files from the public directory (i.e. HTML, png, etc.)

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling missing routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

app.use(globalErrorHandler);

module.exports = app;
