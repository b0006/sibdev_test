const express = require('express');
const router = express.Router();
const userController = require('../controllers/userscontroller');
const taskController = require('../controllers/taskcontroller');

router.get('/new_task', userController.isLoggedIn, taskController.new_task);

module.exports = router;
