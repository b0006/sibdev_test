let express = require('express');
let router = express.Router();
let authController = require('../controllers/authcontroller.js');
let userController = require('../controllers/userscontroller');
let roleController = require('../controllers/rolecontroller');

//страница атворизации
router.get('/signin', userController.alreadyLoggedIn, authController.signin);
router.post('/signin', authController.signin_post);

//страница регистарции
router.get('/signup', userController.alreadyLoggedIn, authController.signup);
router.post('/signup', authController.signup_post);

router.get('/logout', authController.logout);

router.get('/new_user', userController.isLoggedIn, userController.isAdmin, function(req, res, next) {
    let user = req.session.passport.user;

    roleController.get_roles().then(r_res => {
        res.render('new_user', {
            title: 'Создать нового пользователя',
            user_name: user.name,
            user_id: user.id,
            role: user.role,
            auth: true,
            pid: user.pid,
            roles: JSON.stringify(r_res)
        });
    })
});

router.post('/new_user', userController.isLoggedIn, userController.isAdmin, function(req, res, next) {
    let user = req.session.passport.user;
    let user_data = req.body;
    userController.new_user(user_data.name, user_data.email, user_data.password, user_data.parent, user_data.role).then(user_res => {

        roleController.get_roles().then(rol => {
            res.render('new_user', {
                title: 'Создавть нового пользователя',
                user_name: user.name,
                user_id: user.id,
                role: user.role,
                auth: true,
                pid: user.pid,
                result_create: user_res.message,
                roles: JSON.stringify(rol)
            });
        });
    });
});

module.exports = router;
