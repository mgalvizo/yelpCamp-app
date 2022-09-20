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
// and router.use('/:id/reviews', reviewRouter) to the camgroundRoutes
exports.createReview = tryCatch(async (req, res) => {
    const { campground_id } = req.params;
    const campground = await Campground.findById(campground_id);
    const review = await Review.create(req.body.review); // create triggers a save()
    campground.reviews.push(review);
    await campground.save();
    req.flash('success', 'Review added successfully');

    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete review from campground
// The $pull Mongo operator removes from an existing array all instances of a value or
// values that match a specified condition.
exports.deleteReview = tryCatch(async (req, res) => {
    const { id, campground_id } = req.params;
    // Pull from the reviews array the element with the ObjectId of the review
    const campground = await Campground.findByIdAndUpdate(campground_id, {
        $pull: { reviews: id },
    });
    const review = await Review.findByIdAndDelete(id);
    req.flash('success', 'Review deleted successfully');

    res.redirect(`/campgrounds/${campground._id}`);
});
