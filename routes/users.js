let express = require('express');
let router = express.Router();
let authController = require('../controllers/authcontroller.js');

//страница атворизации
router.get('/signin', alreadyLoggedIn, authController.signin);
router.post('/signin', authController.signin_post);

//страница регистарции
router.get('/signup', alreadyLoggedIn, authController.signup);
router.post('/signup', authController.signup_post);

router.get('/logout', authController.logout);

function alreadyLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/');
    else
        return next();

}

module.exports = router;
