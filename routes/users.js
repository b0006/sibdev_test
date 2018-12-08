let express = require('express');
let router = express.Router();
let authController = require('../controllers/authcontroller.js');
let passport = require('passport');

//страница атворизации
router.get('/signin', authController.signin);
router.post('/signin', function(req, res, next) {

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
});



//страница регистарции
router.get('/signup', authController.signup);
router.post('/signup', function(req, res, next) {
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
});

router.get('/logout', authController.logout);


// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();
//
//     res.redirect('/');
// }

module.exports = router;
