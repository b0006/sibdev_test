const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const userController = require('../controllers/userscontroller');

//страница атворизации
router.get('/signin', userController.alreadyLoggedIn, authController.signin);
router.post('/signin', authController.signin_post);

//страница регистарции
router.get('/signup', userController.alreadyLoggedIn, authController.signup);
router.post('/signup', authController.signup_post);

router.get('/logout', authController.logout);

router.get('/new_user', userController.isLoggedIn, userController.isAdmin, userController.new_user_get);

router.post('/new_user', userController.isLoggedIn, userController.isAdmin, userController.new_user_post);

module.exports = router;
