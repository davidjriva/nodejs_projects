const express = require('express');

const { aliasTopTours, getTours, getTour, createTour, updateTour, deleteTour, getTourStats } = require(`${__dirname}/../controllers/tourController`);

const router = express.Router();

// Parameter specific middleware; it only runs on requests with an id param and validates it
router.route('/top-5-cheap')
    .get(aliasTopTours, getTours);

router.route('/tour-stats')
    .get(getTourStats);

router.route('/')
    .get(getTours)
    .post(createTour);
router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;
