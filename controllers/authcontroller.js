let passport = require('passport');

module.exports.signup = function(req,res){
    res.render('./auth/signup', {
        title: 'Регистрация',
    });
};

module.exports.signup_post = function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.render('./auth/signup', { errorRegisterMessage: info.message })
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/main');
        });
    })(req, res, next);
}

module.exports.signin = function(req,res){
    res.render('./auth/signin', {
        title: 'Авторизация',
    });
};

module.exports.signin_post = function(req, res,next) {
    passport.authenticate('local-signin', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.render('./auth/signin', { errorAuthMessage: info.message })
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/main');
        });
    })(req, res, next);
};

module.exports.logout = function(req,res){
    req.session.destroy(function(err) {
        res.redirect('/');
    });
};
