let createError = require('http-errors');
let express = require('express');
let app = express();
let passport = require('passport');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let logger = require('morgan');
let http = require('http').Server(app);
let port = process.env.PORT || 3000;

//routers
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

//Models
let models = require('./models/');

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

// For Passport
app.use(session({
    // store: new RedisStore({
    //     url: 'redis://localhost',
    // }),
    secret: 'punks not dead',
    resave: true, // saved new sessions
    saveUninitialized: true, // do not automatically write to the session store
    cookie: {
        maxAge: new Date(Date.now() + 3600000),
        expires: new Date(Date.now() + 3600000)
    }
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Sync Database
models.sequelize.sync().then(function() {

    http.listen(port, function() {
        console.log('listening on *: ' + port);
    });

    console.log('Nice! Database looks fine');
}).catch(function(err) {
    console.log(err, 'Something went wrong with the Database Update!');
});

module.exports = app;
