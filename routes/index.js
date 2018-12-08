let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        let user = req.session.passport.user;

        res.render('index', {
            title: 'Главная',
            user_name: user.name,
            auth: true
        });
    }
    else {
        res.render('index', {
            title: 'Главная',
            auth: false
        });
    }
});

router.get('/main', isLoggedIn, function(req, res, next) {
    let user = req.session.passport.user;
    res.render('main', {
        title: 'Рабочее место',
        user_name: user.name,
        auth: true
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;
