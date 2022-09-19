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
    const campground = await Campground.create(req.body.campground);

    res.redirect(`/campgrounds/${campground._id}`);
});

// Get one campground by id
exports.getCampground = tryCatch(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
    });

    res.render('campgrounds/details', {
        campground,
    });
});

// Update campground render route
exports.getUpdateCampgroundForm = tryCatch(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

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

    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete campgroud route
exports.deleteCampground = tryCatch(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
});
