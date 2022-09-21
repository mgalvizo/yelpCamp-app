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

    // Check if returnTo has a value
    const redirectUrl = req.session.returnTo || '/campgrounds';

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

// Middleware that checks if the user is logged in
exports.isLoggedIn = (req, res, next) => {
    // isAuthenticated is a passport method that is included in the req object
    // when attempting to log in
    if (!req.isAuthenticated()) {
        // Add a property to the session object that stores the url from which the user tried to log in
        // because of a redirection to the login page when attempting to access a protected route
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'You must be logged in');

        return res.redirect('/users/login');
    }

    next();
};
