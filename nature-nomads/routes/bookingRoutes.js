const express = require('express');
const path = require('path');

const authController = require(path.join(__dirname, '../controllers/authController'));
const bookingController = require(path.join(__dirname, '../controllers/bookingController'));

const router = express.Router();

router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession);

module.exports = router;
