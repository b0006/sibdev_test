const path = require('path');
const fs = require('fs');
const userController = require('../controllers/userscontroller');
const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports.new_task = function(req, res) {
	let user = req.session.passport.user;

	if(user.role === 1){
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
	}
	else {
		userController.get_child(user.id).then(result => {
        	let users = [];

        	if(result.length > 0) {
				users = result;
			}

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
	}
};

module.exports.new_task_post = function (req, res) {
	const form_data = req.body;

	let file_upload = true;

	if (Object.keys(req.files).length === 0) {
		file_upload = false;
	}

	let new_path_file = null;

	if(file_upload) {
		let sampleFile = req.files.sampleFile;
		const appDir = path.dirname(require.main.filename);

		new_path_file = appDir + '/uploads/' + sampleFile.name;

		fs.writeFileSync(new_path_file, sampleFile.data, function (error) {
			if (error) {
				console.log(error);
			}
		});
	}

	const data = {
		id_creater: form_data.parent,
		title: form_data.title,
		deadline: new Date(form_data.deadline_date + ' ' + form_data.deadline_time),
		responsible: form_data.responsible
	};

	if(file_upload){
		data.file = new_path_file;
	}


	if(typeof form_data.id_task === 'undefined') {
		model.task.create(data).then(result => {
			console.log(result);

			res.redirect('/new_task');
		}).catch(err => {
			console.log(err);
		});
	}
	else {
		model.task.update(data, {where: {id: form_data.id_task}}).then(result => {
			console.log(result);

			res.redirect('/all_tasks');
		}).catch(err => {
			console.log(err);
		});
	}
};

module.exports.all_tasks_get = function (req, res) {
	const user = req.session.passport.user;

	let tasks_db = null;

	if(user.role !== 1){
		let where = [];

		const childs = userController.get_child(user.id);

		tasks_db = childs.then(child => {
			child.map(item => {
				where.unshift({responsible: item.id});
			});

			where.unshift({responsible: user.id});

			return model.task.findAll({where: {
				[Op.or]: where
			}, include: [{ all: true, nested: true }]}).then(result => {
				let tasks = [];
				let task = [];

				let date_dead = null;
				let date = null;
				let time = null;
				let hours = null;

				result.map(item => {
					task = item.dataValues;

					date_dead = new Date(task.deadline);
					date = date_dead.getFullYear() + '-' + (date_dead.getMonth() + 1) + '-' + date_dead.getDate();

					hours = date_dead.getHours();
					if(hours >= 0 && hours <= 9){
						hours = '0' + hours;
					}
					time = hours + ':' + date_dead.getMinutes();
					task.time = time;
					task.date = date;

					task.creater = task.creater.dataValues.name;
					task.respon = task.respon.dataValues.name;

					tasks.push(task);

				});

				return tasks;
			});
		});
	}
	else {
		tasks_db = model.task.findAll({include: [{ all: true, nested: true }]}).then(result => {
			let tasks = [];
			let task = [];

			let date_dead = null;
			let date = null;
			let time = null;
			let hours = null;

			result.map(item => {
				task = item.dataValues;

				date_dead = new Date(task.deadline);
				date = date_dead.getFullYear() + '-' + (date_dead.getMonth() + 1) + '-' + date_dead.getDate();

				hours = date_dead.getHours();
				if(hours >= 0 && hours <= 9){
					hours = '0' + hours;
				}
				time = hours + ':' + date_dead.getMinutes();
				task.time = time;
				task.date = date;

				task.creater = task.creater.dataValues.name;
				task.respon = task.respon.dataValues.name;

				tasks.push(task);
			});

			return tasks;
		}).catch(err => {
			console.log(err);
		});
	}

	tasks_db.then(tasks => {
		if(user.role === 1) {
			userController.get_users().then(users => {
				res.render('all_tasks', {
					title: 'Все задачи',
					user_name: user.name,
					user_id: user.id,
					role: user.role,
					auth: true,
					pid: user.pid,
					tasks: JSON.stringify(tasks),
					users: JSON.stringify(users)
				});
			});
		}
		else {
			userController.get_child(user.id).then(users => {
				res.render('all_tasks', {
					title: 'Все задачи',
					user_name: user.name,
					user_id: user.id,
					role: user.role,
					auth: true,
					pid: user.pid,
					tasks: JSON.stringify(tasks),
					users: JSON.stringify(users)
				});
			});
		}
	});
};

module.exports.download_file = function(req, res) {
	const path = req.query.path;
	res.download(path);
};

module.exports.change_task = function (req, res) {
	const form_data = req.body;

	res.redirect('/all_tasks');
};

function get_tasks(user_id) {
	return model.task.findAll({
		where: {
			responsible: user_id
		}
	}).then(tasks => {
		return tasks.map(item => item.dataValues);
	}).catch(err => {
		console.log(err);
	});
}

