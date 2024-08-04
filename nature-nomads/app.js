const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require(path.join(__dirname, 'utils', 'appError'));
const globalErrorHandler = require(path.join(__dirname, 'controllers', 'errorController'));

const tourRouter = require(path.join(__dirname, 'routes', 'tourRoutes'));
const userRouter = require(path.join(__dirname, 'routes', 'userRoutes'));
const reviewRouter = require(path.join(__dirname, 'routes', 'reviewRoutes'));
const viewRouter = require(path.join(__dirname, 'routes', 'viewRoutes'));

const app = express();

// GLOBAL MIDDLEWARES

// Template Engine Setup (Views):
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

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
  message: 'Too many requests are coming from this IP, please try again in an hour.',
});
app.use('/api', limiter);

// Body parsers - reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // Adds the body into the request object as JSON.

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'], // properties where duplicates are allowed in query string
  })
);

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Handling missing routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

app.use(globalErrorHandler);

module.exports = app;
