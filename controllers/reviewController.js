const Campground = require('../models/campgroundModel');
const Review = require('../models/reviewModel');
const tryCatch = require('../utilities/tryCatch');
const AppError = require('../utilities/appError');
const reviewJoiSchema = require('../joiSchemas/reviewJoiSchema');

exports.validateReview = (req, res, next) => {
    // Pass the payload (req.body) through Joi's validate function
    const { error } = reviewJoiSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new AppError(message, 400);
    }

    next();
};

// Add review to campground
// We get access to the id from params because we are adding {mergeParams: true} to the reviewRoutes
// and router.use('/:review_id/reviews', reviewRouter) to the camgroundRoutes
exports.createReview = tryCatch(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added successfully');

    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete review from campground
// The $pull Mongo operator removes from an existing array all instances of a value or
// values that match a specified condition.
exports.deleteReview = tryCatch(async (req, res) => {
    const { id, review_id } = req.params;
    // Pull from the reviews array the element with the ObjectId of the review
    const campground = await Campground.findByIdAndUpdate(id, {
        $pull: { reviews: review_id },
    });
    const review = await Review.findByIdAndDelete(review_id);
    req.flash('success', 'Review deleted successfully');

    res.redirect(`/campgrounds/${campground._id}`);
});
