const User = require('../models/userModel');
const tryCatch = require('../utilities/tryCatch');
const AppError = require('../utilities/appError');

exports.getRegistrationForm = (req, res) => {
    res.render('users/new');
};

exports.registerUser = tryCatch(async (req, res) => {
    // Another layer of try...catch so the error messages appear with flash
    // Different option instead of redirecting to an error template
    try {
        const { username, email, password } = req.body.user;
        // No need to add the password
        const user = new User({ username, email });
        // Register the user and the password
        // register(user, password, cb) Convenience method to register a new user instance with a
        // given password. Checks if username is unique.
        const registeredUser = await User.register(user, password);

        // Passport exposes a login() function on req (also aliased as logIn()) that can be used
        // to establish a login session.
        req.login(registeredUser, err => {
            if (err) {
                return next(new AppError(err.message, 500));
            }

            req.flash('success', `Welcome to Yelp Camp ${req.user.username}`);

            return res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('/users');
    }
});

exports.getLoginForm = (req, res) => {
    res.render('users/login');
};

exports.loginUser = tryCatch(async (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}`);

    let redirectUrl = '/campgrounds';

    // Check if returnTo exists
    if (req.session.returnTo) {
        redirectUrl = req.session.returnTo.url;
    }

    // Check if returnTo exists and contains the property of the campground id
    if (req.session.returnTo && req.session.returnTo.campground_id) {
        redirectUrl = `/campgrounds/${req.session.returnTo.campground_id}`;
    }

    // Delete the returnTo property from the session manually
    delete req.session.returnTo;

    res.redirect(redirectUrl);
});

// Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler
// which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
exports.logoutUser = tryCatch(async (req, res) => {
    req.logout(err => {
        if (err) {
            return next(new AppError(err.message, 500));
        }

        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});
