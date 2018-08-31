var express = require('express');
var router = express.Router();




// Register
router.get('/', ensureAuthenticated, function (req, res, next) {
	res.render('dashboard');
});
// Register
router.get('/settings', ensureAuthenticated, function (req, res) {
	res.render('settings');
});




function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/');
		console.log('Not Authenticated');
	}
}


module.exports = router;
