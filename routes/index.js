const express = require('express');
const router = express.Router();
const userController = require('../controllers/userscontroller');

router.get('/', function(req, res) {
	if (req.isAuthenticated()) {
		let user = req.session.passport.user;

		res.render('index', {
			title: 'Главная',
			user_name: user.name,
			auth: true,
			role: user.role
		});
	}
	else {
		res.render('index', {
			title: 'Главная',
			auth: false
		});
	}
});

router.get('/admin_tree', userController.isLoggedIn, userController.isAdmin, function (req, res) {
	let user = req.session.passport.user;

	userController.get_users().then(users => {
		res.render('admin_tree', {
			title: 'Управление структурой',
			user_name: user.name,
			user_id: user.id,
			auth: true,
			role: user.role,
			users: JSON.stringify(users)
		});
	});
});

module.exports = router;
