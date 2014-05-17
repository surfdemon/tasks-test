module.exports = function(app, passport){
	app.get('/', function(req, res){
	  res.sendfile('./views/index.html');
	});
//	app.get('/tasks', function(req, res){
//	  res.render('tasks');
//	});
//	app.get('/tasks/login', function(req, res){
//		res.render('login', {message : req.flash('loginMessage')});
//	});
//	app.post('/tasks/login', passport.authenticate('local-login', {
//		successRedirect : '/',
//		failureRedirect : '/tasks/login',
//		failureFlash : true
//	}));
//	app.get('/tasks/signup', function(req, res){
//		res.render('signup', {message : req.flash('signMessage')});
//	});
//	app.post('/tasks/signup', passport.authenticate('local-signup',{
//		successRedirect : '/',
//		failureRedirect : '/tasks/signup',
//		failureFlash : true
//	}));
//	app.get('/tasks/logout', function(req, res){
//		req.logout();
//		res.render('tasks');
//	});
//	app.get('/tasks/app', isLoggedIn, function(req, res){
//	  res.render('tasks-app-index', {
//	  	user : req.user
//	  });
//	});
//	app.get('/tasks/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
//	app.get('/tasks/auth/facebook/callback', passport.authenticate('facebook', {
//		successRedirect : '/',
//		failureRedirect : '/tasks/login'
//	}));
};

//function isLoggedIn (req, res, next) {
//	if (req.isAuthenticated())
//		return next();
//
//	res.redirect('/tasks/login');
//}