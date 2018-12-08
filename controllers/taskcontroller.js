let path = require('path');
let Sequelize = require('sequelize');
let config_db = require(path.join(__dirname, '..', 'config', 'config.json'))['database'];
let sequelize = new Sequelize(config_db.database, config_db.username, config_db.password, config_db);
let model = require('../models');

let userController = require('../controllers/userscontroller');

module.exports.new_task = function(req, res, next) {
    let user = req.session.passport.user;

    userController.get_users().then(users => {
        res.render('new_task', {
            title: "Создать новую задачу",
            user_name: user.name,
            user_id: user.id,
            role: user.role,
            auth: true,
            pid: user.pid,
            users: JSON.stringify(users)
        })
    });
};
