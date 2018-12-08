let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        let user = req.session.passport.user;

        res.render('index', {
            title: 'Главная',
            user_name: user.name,
            auth: true,
            role: user.role
        });
    }
    else {
        res.render('index', {
            title: 'Главная',
            auth: false
        });
    }
});

module.exports = router;
