const express = require('express');

const reviewController = require(`${__dirname}/../controllers/reviewController`);
const authController = require(`${__dirname}/../controllers/authController`);

// mergeParams: gives access to parameters coming from the parent route [route nesting]
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(reviewController.getReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);

router.route('/:id')
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;