const express = require('express');

const { getTours, getTour, createTour, updateTour, deleteTour } = require(`${__dirname}/../controllers/tourController`);

const router = express.Router();

// Parameter specific middleware; it only runs on requests with an id param and validates it
router.route('/')
    .get(getTours)
    .post(createTour);
router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;
