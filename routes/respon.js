const express = require('express');
const router = express.Router();
const responController = require('../controllers/responcontroller');
const userController = require('../controllers/userscontroller');

router.post('/set_owner', userController.isLoggedIn, userController.isAdmin, responController.set_owner);

module.exports = router;