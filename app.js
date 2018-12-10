const createError = require('http-errors');
const express = require('express');
const app = express();
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('morgan');
const http = require('http').Server(app);
const port = process.env.PORT || 3000;
const fileUpload = require('express-fileupload');

//routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tasksRouter = require('./routes/tasks');
const responRouter = require('./routes/respon');

//Models
const models = require('./models/');

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
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', tasksRouter);
app.use('/', responRouter);

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

// module.exports = app;
