module.exports.signup = function(req,res){
    res.render('./auth/signup', {
        title: 'Регистрация',
    });
};

module.exports.signin = function(req,res){
    res.render('./auth/signin', {
        title: 'Авторизация',
    });
};

module.exports.logout = function(req,res){
    req.session.destroy(function(err) {
        res.redirect('/');
    });
};
