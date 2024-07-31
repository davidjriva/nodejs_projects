const express = require('express');

const tourController = require(`${__dirname}/../controllers/tourController`);
const authController = require(`${__dirname}/../controllers/authController`);
const reviewRouter = require(`${__dirname}/../routes/reviewRoutes`);

const router = express.Router();

// Nested Route: Transfers requests to /tours/:tourId/reviews to the review router
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getTours);

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
    .get(authController.protect, authController.restrictTo('admin', 'guide', 'lead-guide'), tourController.getMonthlyPlan);

router.route('/')
    .get(tourController.getTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
