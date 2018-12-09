const bCrypt = require('bcrypt-nodejs');
const model = require('../models');
const roleController = require('../controllers/rolecontroller');

function new_user (name, email, password, parent, role){
	return model.user.findOne({
		where: {
			email: email
		}
	}).then(function(user) {

		if (user)
		{
			return {
				success: false,
				message: 'Введенный Вами Email уже занят'
			};
		}
		else
		{
			let userPassword = bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
			let data =
                {
                	email: email,
                	password: userPassword,
                	pid: parseInt(parent),
                	name: name,
                	role: parseInt(role)
                };

			return model.user.create(data).then(function(newUser) {

				if (!newUser) {
					return {
						success: false,
						message: 'Ошибка добавления нового пользователя'
					};
				}

				if (newUser) {
					return {
						success: true,
						data: newUser,
						message: 'Новый пользователь создан'
					};
				}
			});
		}
	});
};

module.exports.new_user_get = function(req, res, next) {
	let user = req.session.passport.user;

	roleController.get_roles().then(r_res => {
		res.render('new_user', {
			title: 'Создать нового пользователя',
			user_name: user.name,
			user_id: user.id,
			role: user.role,
			auth: true,
			pid: user.pid,
			roles: JSON.stringify(r_res)
		});
	});
};

module.exports.new_user_post = function(req, res, next) {
	let user = req.session.passport.user;
	let user_data = req.body;
	new_user(user_data.name, user_data.email, user_data.password, user_data.parent, user_data.role).then(user_res => {

		roleController.get_roles().then(rol => {
			res.render('new_user', {
				title: 'Создавть нового пользователя',
				user_name: user.name,
				user_id: user.id,
				role: user.role,
				auth: true,
				pid: user.pid,
				result_create: user_res.message,
				roles: JSON.stringify(rol)
			});
		});
	});
};

module.exports.get_users = function () {
	return model.user.findAll(
		{
			attributes: ['id', 'name', 'role']
		}
	).then(users => {
		return users.map(item => item.dataValues);
	}).catch(err => {
		console.log(err);
	});
};

module.exports.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/signin');
};

module.exports.isAdmin = function(req, res, next) {
	let user = req.session.passport.user;

	if (user.role === 1)
		return next();

	res.redirect('/');
};

module.exports.alreadyLoggedIn = function(req, res, next) {
	if (req.isAuthenticated())
		res.redirect('/');
	else
		return next();
};

module.exports.new_user = new_user;
