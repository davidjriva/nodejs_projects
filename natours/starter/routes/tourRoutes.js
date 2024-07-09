const express = require('express');

const tourController = require(`${__dirname}/../controllers/tourController`);

const router = express.Router();

// Parameter specific middleware; it only runs on requests with an id param and validates it
router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getTours);

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

router.route('/')
    .get(tourController.getTours)
    .post(tourController.createTour);
router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
