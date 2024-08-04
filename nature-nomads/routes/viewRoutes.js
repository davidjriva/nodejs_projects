const express = require('express');
const path = require('path');

const viewController = require(path.join(__dirname, '../controllers/viewController'));

const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);

module.exports = router;
