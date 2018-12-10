const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user) {

	let User = user;
	let LocalStrategy = require('passport-local').Strategy;

	passport.use('local-signup', new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},

		function(req, email, hash, done) {
			let generateHash = function(hash) {
				return bCrypt.hashSync(hash, bCrypt.genSaltSync(8), null);
			};

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
                        	name: req.body.name,
                        	role: 1
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

	passport.serializeUser(function(user, done) {
		done(null, {
			id: user.id,
			pid: user.pid,
			name: user.name,
			role: user.role
		});
	});

	passport.deserializeUser(function(user, done) {
		User.findByPk(user.id).then(function(user) {
			if (user) {
				done(null, user.get());
			} else {
				done(user.errors, null);
			}
		});
	});

	passport.use('local-signin', new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true

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
				console.log('Error:', err);
				return done(null, false, {
					message: 'Ой. Неизвестная ошибка авторизации.'
				});
			});
		}
	));
};