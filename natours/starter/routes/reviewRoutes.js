const express = require('express');

const reviewController = require(`${__dirname}/../controllers/reviewController`);
const authController = require(`${__dirname}/../controllers/authController`);

// mergeParams: gives access to parameters coming from the parent route [route nesting]
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
    .get(reviewController.getReviews)
    .post(authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);

router.route('/:id')
    .delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview)
    .patch(authController.restrictTo('admin', 'user'), reviewController.updateReview)
    .get(reviewController.getReview);

module.exports = router;