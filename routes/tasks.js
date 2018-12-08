let express = require('express');
let router = express.Router();
let userController = require('../controllers/userscontroller');
let taskController = require('../controllers/taskcontroller');

router.get('/new_task', userController.isLoggedIn, taskController.new_task);

module.exports = router;
