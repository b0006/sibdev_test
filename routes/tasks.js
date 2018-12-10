const express = require('express');
const router = express.Router();
const userController = require('../controllers/userscontroller');
const taskController = require('../controllers/taskcontroller');

router.get('/new_task', userController.isLoggedIn, taskController.new_task);
router.post('/new_task', userController.isLoggedIn, taskController.new_task_post);

router.get('/all_tasks', userController.isLoggedIn, taskController.all_tasks_get);

router.post('/change_task', userController.isLoggedIn, taskController.new_task_post);

router.get('/download', userController.isLoggedIn, taskController.download_file);

router.get('/delete_task', userController.isLoggedIn, taskController.delete_task);

router.get('/user_task', userController.isLoggedIn, userController.isAdmin, taskController.get_user_tasks);

module.exports = router;
