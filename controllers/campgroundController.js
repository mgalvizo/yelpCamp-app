const Campground = require('../models/campgroundModel');
const Review = require('../models/reviewModel');
const tryCatch = require('../utilities/tryCatch');
const AppError = require('../utilities/appError');
const campgroundJoiSchema = require('../joiSchemas/campgroundJoiSchema');

// Middleware that validates the New and Update forms for campgrounds
exports.validateCampground = (req, res, next) => {
    // Pass the payload (req.body) through Joi's validate function
    const { error } = campgroundJoiSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new AppError(message, 400);
    }

    next();
};

// Get all campgrounds template
exports.getAllCampgrounds = tryCatch(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render('campgrounds/index', {
        campgrounds,
    });
});

// Create new campground render route
exports.getNewCampgroundForm = (req, res) => {
    res.render('campgrounds/new');
};

// Create new campground POST route
exports.createCampground = tryCatch(async (req, res) => {
    // Pass the campground object from the req.body
    const campground = new Campground(req.body.campground);
    // Set the author to the user id that we get from a logged in user in the req object
    campground.author = req.user._id;
    await campground.save();
    // Set a flash message for campground creations with the key of "success"
    req.flash('success', 'Campground created successfully');

    res.redirect(`/campgrounds/${campground._id}`);
});

// Get one campground by id
exports.getCampground = tryCatch(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            // nested populate because we want to get access to the author of each review
            populate: {
                path: 'author',
            },
        })
        .populate({ path: 'author' });

    if (!campground) {
        req.flash('error', 'Cannot find that campground');

        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/details', {
        campground,
    });
});

// Update campground render route
exports.getUpdateCampgroundForm = tryCatch(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'Cannot find that campground');

        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', {
        campground,
    });
});

// Update campground PUT route
exports.updateCampground = tryCatch(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(
        id,
        {
            ...req.body.campground,
        },
        { new: true }
    );
    req.flash('success', 'Campground updated successfully');

    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete campgroud route
exports.deleteCampground = tryCatch(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted successfully');

    res.redirect('/campgrounds');
});
