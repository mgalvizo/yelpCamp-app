const tryCatch = require('../utilities/tryCatch');
const AppError = require('../utilities/appError');

const Campground = require('../models/campgroundModel');
const Review = require('../models/reviewModel');

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

// Middleware that checks if the current user is the author of the campground so
// it can edit and delete the campground
exports.isCampgroundAuthor = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // equals(): Compares the equality of this ObjectID with <code>otherID</code>.
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');

        return res.redirect(`/campgrounds/${id}`);
    }

    next();
});

// Middleware that checks if the current user is the author of the review so
// it can delete the review
exports.isReviewAuthor = tryCatch(async (req, res, next) => {
    const { id, campground_id } = req.params;
    const review = await Review.findById(id);
    // equals(): Compares the equality of this ObjectID with <code>otherID</code>.
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');

        return res.redirect(`/campgrounds/${campground_id}`);
    }

    next();
});
