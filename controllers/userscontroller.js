let path = require('path');
let Sequelize = require('sequelize');
let config_db = require(path.join(__dirname, '..', 'config', 'config.json'))['database'];
let sequelize = new Sequelize(config_db.database, config_db.username, config_db.password, config_db);
let bCrypt = require('bcrypt-nodejs');
let model = require('../models');

module.exports.new_user = function(name, email, password, parent, role){
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
            }
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
                    }
                }

                if (newUser) {
                    return {
                        success: true,
                        data: newUser,
                        message: 'Новый пользователь создан'
                    }
                }
            });
        }
    });
};

module.exports.get_users = function () {
    return model.user.findAll(
        {
            attributes: ['id', 'name']
        }
    ).then(users => {
        return users.map(item => item.dataValues);
    }).catch(err => {
        console.log(err);
    })
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
