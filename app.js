var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
 
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.once('open', function callback(){
	console.log('database connection has been opened');
});

require('./config/passport')(passport);

app.configure(function(){
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.static('./public'));
	app.use(express.compress());
	app.use(express.responseTime());
	app.use(express.errorHandler());
	app.use(express.session({secret: 'thisisaSecretCode123412321'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(app.router);
});

require('./app/routes.js')(app, passport);

var server = app.listen(8082, function(){
  console.log('Listening on port %d', server.address().port);
});
