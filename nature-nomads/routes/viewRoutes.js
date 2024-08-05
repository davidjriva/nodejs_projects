const express = require('express');
const path = require('path');

const viewController = require(path.join(__dirname, '../controllers/viewController'));

const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/tour/:slug', viewController.getTour);

// Create a /login route with controller & template for login
// Template is found in the dev-data/templates folder
router.get('/login', viewController.getLoginForm)

module.exports = router;
