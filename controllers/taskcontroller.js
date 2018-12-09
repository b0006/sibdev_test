// const model = require('../models');

let userController = require('../controllers/userscontroller');

module.exports.new_task = function(req, res, next) {
	let user = req.session.passport.user;

	userController.get_users().then(users => {
		res.render('new_task', {
			title: 'Создать новую задачу',
			user_name: user.name,
			user_id: user.id,
			role: user.role,
			auth: true,
			pid: user.pid,
			users: JSON.stringify(users)
		});
	});
};
