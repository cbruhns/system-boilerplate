var express = require('express');
var router = express.Router();



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}


// Register
router.get('/dashboard', ensureAuthenticated, function (req, res) {
	res.render('dashboard');
});
// Register
router.get('/dashboard/settings', ensureAuthenticated, function (req, res) {
	res.render('settings');
});

module.exports = router;
