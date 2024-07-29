const express = require('express');

const tourController = require(`${__dirname}/../controllers/tourController`);
const authController = require(`${__dirname}/../controllers/authController`);
const reviewController = require(`${__dirname}/../controllers/reviewController`);

const router = express.Router();

// Parameter specific middleware; it only runs on requests with an id param and validates it
router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getTours);

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

router.route('/')
    .get(authController.protect, tourController.getTours)
    .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

// Nested Route: Parent-Child relationship between resources --> POST request to /tour/:tourId/reviews
//                                                               GET Request to ".../reviews/:reviewId"
//                                                               GET request to ".../reviews/"

router.route('/:tourId/reviews')
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

module.exports = router;
