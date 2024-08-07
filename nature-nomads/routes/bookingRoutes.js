const express = require('express');
const path = require('path');

const authController = require(path.join(__dirname, '../controllers/authController'));
const bookingController = require(path.join(__dirname, '../controllers/bookingController'));

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin'));

router.route('/:id')
    .get(bookingController.getOneBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

router.route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBookingManually);

module.exports = router;
