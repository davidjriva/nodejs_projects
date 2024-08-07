const { StatusCodes } = require('http-status-codes');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const sendResponse = require(path.join(__dirname, '../utils/sendResponse'));
const catchAsync = require(path.join(__dirname, '../utils/catchAsync'));
const AppError = require(path.join(__dirname, '../utils/appError'));
const Booking = require(path.join(__dirname, '../models/bookingModel'));
const Tour = require(path.join(__dirname, '../models/tourModel'));
const factory = require(path.join(__dirname, './handlerFactory'));

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // Create checkout session with Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.description,
            images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
          },
        },
      },
    ],
    mode: 'payment',
  });

  sendResponse(res, StatusCodes.OK);
});
