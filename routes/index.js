var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Get Login Screen
router.get('/', function(req, res){
	var isNew = req.query.new == 'true' ? true : false ;
	res.render('login', {successNewAccount: isNew});
});

// Get Register Screen
router.get('/register', function(req, res){
	res.render('register');
});

passport.use(new LocalStrategy(function (email, password, done) {
    User.getUserByEmail(email, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Unknown User' });
        }

        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid password' });
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});



// Register User
router.post('/register', function (req, res) {

	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var github = req.body.github;
	var password = req.body.password;
	var password2 = req.body.password2;

	var formData = {
		firstname : firstname,
		lastname : lastname,
		email : email,
		github : github
	}

	// Validation
	req.checkBody('firstname', 'First Name is required').notEmpty();
	req.checkBody('lastname', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('github', 'Github Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors,
			formData: formData
		});
	}
	else {
		User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
			if (mail) {
				res.render('register', {
					mail: mail
				});
			}
			else {
				var newUser = new User({
					firstname: firstname,
					lastname: lastname,
					email: email,
					github: github,
					password: password,
					created: new Date()
				});
				User.createUser(newUser, function (err, user) {
					if (err) throw err;
					// console.log(user);
				});
				res.redirect('/?new=true');
			}
		});

	}
});


passport.use(new LocalStrategy({
	    usernameField: 'email',
	    passwordField: 'password'
	}, function (email, password, done) {
	User.getUserByEmail(email, function (err, user) {
		if (err) throw err;
		if (!user) {
			return done(null, false, { message: 'Unknown User' });
			console.log('Unknown User');
		}
		User.comparePassword(password, user.password, function (err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				console.log('GOOD');
				return done(null, user);
			} else {
				console.log('Invalid password');
				return done(null, false, { message: 'Invalid password' });
			}
		});
	});
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: false }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	res.redirect('/');
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: false }),
    function (req, res) {
        res.redirect('/dashboard');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
