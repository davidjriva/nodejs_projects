const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const { StatusCodes } = require('http-status-codes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARES

// Set security HTTP Headers
app.use(helmet());

// Logging middleware [dev only]
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //Morgan: Logging Middleware
}

// Limit Requests - Prevents the max number of requests per IP address
// App crashes/shutdowns reset the rate limiter
const limiter = rateLimit({
  max: 250,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests are coming from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parsers - reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // Adds the body into the request object as JSON.

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling missing routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

app.use(globalErrorHandler);

module.exports = app;
