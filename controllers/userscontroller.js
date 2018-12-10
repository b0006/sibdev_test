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

module.exports.get_user = function (user_id) {
	return model.user.findOne({
		attributes: ['id', 'name', 'role', 'pid', 'email'],
		where: {
			id: user_id
		}
	}).then(user => {
		return user;
	}).catch(err => {
		console.log(err);
	});
};

function get_users() {
	return model.user.findAll({
		attributes: ['id', 'name', 'role', 'pid', 'email'],
		include:
            {
            	model: model.responsible,
            	as: 'res'
            },
		required: false

	}).then(users => {
		return users.map(item => item.dataValues);
	}).catch(err => {
		console.log(err);
	});
};

module.exports.new_user_get = function(req, res, next) {
	let user = req.session.passport.user;

	roleController.get_roles().then(r_res => {
		get_users().then(users => {
			res.render('new_user', {
				title: 'Создать нового пользователя',
				user_name: user.name,
				user_id: user.id,
				role: user.role,
				auth: true,
				pid: user.pid,
				users: JSON.stringify(users),
				roles: JSON.stringify(r_res)
			});
		});
	});
};

module.exports.new_user_post = function(req, res, next) {
	let user = req.session.passport.user;
	let user_data = req.body;
	new_user(user_data.name, user_data.email, user_data.password, user_data.parent, user_data.role).then(user_res => {

		roleController.get_roles().then(rol => {
			get_users().then(users => {
				res.render('new_user', {
					title: 'Создавть нового пользователя',
					user_name: user.name,
					user_id: user.id,
					role: user.role,
					auth: true,
					pid: user.pid,
					users: JSON.stringify(users),
					result_create: user_res.message,
					roles: JSON.stringify(rol)
				});
			});

		});
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

function create_tree (sec, parent_id){

	let tree = '<ul>';

	for(let i =0; i < sec.length; i++) {
	    if(sec[i].pid === parent_id) {
	        tree += '<li id="tree_user_' + sec[i].id + '" user_id="' + sec[i].id + '">'  + sec[i].name;
	        tree += create_tree (sec, sec[i].id);
	        tree += '</li>';
	    }
	}
	tree += '</ul>';

	return tree;
}

function create_tree_array (sec, parent_id){

	let tree = [];

	for(let i =0; i < sec.length; i++) {
    	if(sec[i].pid === parent_id) {
    		tree.push(sec[i].id);
    		tree.push(create_tree_array (sec, sec[i].id));
    	}
	}

	return tree;
}

function get_ar_users(users){
	let ar_users = [];
	let respon_db = [];
	let respon = [];
	let parents = [];

	let users_list = new Map();

	users.map(us => {
		users_list.set(us.id, us);
	});

	users.map(us => {
		// список подчиненных (права, выданные админом)
		respon_db = [];
		respon = [];
		if(us.res.length > 0){
			us.res.map(item => {
				respon_db.push(item.dataValues);
			});
		}

		//список родителей
		if(us.pid !== -1){
			let parent = users_list.get(us.pid);
			parents = [];
			if(typeof parent !== 'undefined') {
				parents.push(parent);
				do {
					parent = users_list.get(parent.pid);
					if (typeof parent !== 'undefined')
						parents.push(parent);
					else
						break;
				}
				while (parent.pid !== -1);
			}
		}

		// console.log('NAME: ' + us.name);

		ar_users.push({
			id: us.id,
			name: us.name,
			role: us.role,
			pid: us.pid,
			res: JSON.stringify(respon_db),
			parents: JSON.stringify(parents),
		});
	});

	return ar_users;
}

module.exports.admin_tree = function (req, res) {
	let user = req.session.passport.user;

	get_users().then(users => {
		let tree = create_tree(users, -1);
		let tree_array = create_tree_array(users, -1);

		res.render('admin_tree', {
			title: 'Управление структурой',
			user_name: user.name,
			user_id: user.id,
			auth: true,
			role: user.role,
			users: JSON.stringify(get_ar_users(users)),
			tree: tree,
			tree_array: JSON.stringify(tree_array)
		});
	});
};

module.exports.change_owner = function(req, res){
	const user_id = req.body.user_id;
	const pid = req.body.pid;

	model.user.update(
		{ pid: pid },
		{ where: { id: user_id }}
	).then(result => {
		res.redirect('/admin_tree');
	}).catch(err => {
		console.log(err);
	});
};

module.exports.delete_user_get = function(req, res){
	const user = req.session.passport.user;

	get_users().then(users => {
		res.render('delete_user', {
			title: 'Удалить пользователя',
			user_name: user.name,
			user_id: user.id,
			auth: true,
			role: user.role,
			users: JSON.stringify(users)
		});
	});

};

module.exports.delete_user_post = function(req, res){
	const user = req.session.passport.user;
	const user_id = req.body.user_id;

	const childs = get_child(user_id).catch(err => {console.log(err);});

	childs.then(result => {
		if(result.length > 0){
			const parent = model.user.findOne({
				where: {
					id: user_id
				}
			}).catch(err => {console.log(err);});

			parent.then(us => {
				if(us !== null) {
					result.map(item => {
						model.user.update(
							{pid: us.dataValues.pid},
							{where: {id: item.id}}
						).then(result => {

						}).catch(err => {
							console.log(err);
						});
					});
				}

				model.user.destroy({
					where: {
						id: user_id
					}
				}).then(result => {
					get_users().then(users => {
						res.render('delete_user', {
							title: 'Удалить пользователя',
							user_name: user.name,
							user_id: user.id,
							auth: true,
							role: user.role,
							result_delete: 'Пользователь удален',
							users: JSON.stringify(users)
						});
					});
				}).catch(err => {
					console.log(err);
				});
			});
		}
	});

};

function get_child(user_id) {
	return model.user.findAll({
		where: {
			pid: user_id
		}
	}).then(users => {
		return users.map(item => item.dataValues);
	}).catch(err => {
		console.log(err);
	});
}

module.exports.get_child = get_child;
module.exports.get_users = get_users;
module.exports.new_user = new_user;
