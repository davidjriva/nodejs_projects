const express = require('express');

const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router();

const userController = require(`${__dirname}/../controllers/userController`);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/')
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
