let path = require("path");
let Sequelize = require("sequelize");
let config_db = require(path.join(__dirname, '..', '', 'config.json'))["database"];
let sequelize = new Sequelize(config_db.database, config_db.username, config_db.password, config_db);
let bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {

    // инициализируем локальную стратегию паспорта и модель пользователя
    let User = user;
    let LocalStrategy = require('passport-local').Strategy;

    // определяем нашу пользовательскую стратегию с нашим экземпляром LocalStrategy
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function(req, email, hash, done) {
            let generateHash = function(hash) {
                return bCrypt.hashSync(hash, bCrypt.genSaltSync(8), null);
            };

            //проверим email И логин на уникальность
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {

                if (user)
                {
                    return done(null, false, {
                        message: 'Введенный Вами Email уже занят'
                    });
                }
                else
                {
                    let userPassword = generateHash(hash);
                    let data =
                        {
                            email: email,
                            password: userPassword,
                            pid: -1,
                            name: req.body.name
                        };

                    User.create(data).then(function(newUser, created) {

                        if (!newUser) {
                            return done(null, false);
                        }

                        if (newUser) {
                            return done(null, newUser, {
                                message: 'Регистрация прошла успешно'
                            });
                        }
                    });
                }
            });
        }
    ));

    //serialize
    passport.serializeUser(function(user, done) {
        done(null, {
            id: user.id,
            pid: user.pid,
            name: user.name,
            role: user.role
        });
    });

    // deserialize user
    passport.deserializeUser(function(user, done) {
        User.findByPk(user.id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback

        },

        function(req, email, password, done) {

            let User = user;

            let isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };

            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {

                if (!user) {
                    return done(null, false, {
                        message: 'Введенный Email не зарегистрирован'
                    });
                }

                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Неверный пароль'
                    });

                }

                let userinfo = user.get();
                return done(null, userinfo);

            }).catch(function(err) {

                console.log("Error:", err);

                return done(null, false, {
                    message: 'Ой. Неизвестная ошибка авторизации.'
                });

            });
        }

    ));
};