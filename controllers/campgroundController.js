const Campground = require('../models/campgroundModel');
const Review = require('../models/reviewModel');
const tryCatch = require('../utilities/tryCatch');
const AppError = require('../utilities/appError');
const campgroundJoiSchema = require('../joiSchemas/campgroundJoiSchema');
const multer = require('multer');
const { cloudinary, storage } = require('../cloudinary/cloudinaryConfig');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;

// Initialize a new mapbox geocoding instance
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Use multer
const upload = multer({ storage });

exports.uploadImages = upload.fields([
    // To upload at most 3 images to the campground
    { name: 'campground[images]', maxCount: 3 },
]);

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
    // Get the geoData of the location field of the campground
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();

    // Get images from req.files
    const images = req.files['campground[images]'];
    // Map the data into an array
    const imageData = images.map(image => {
        return { url: image.path, filename: image.filename };
    });
    // Pass the campground object from the req.body
    const campground = new Campground(req.body.campground);
    // Add the geometry data to the model
    campground.geometry = geoData.body.features[0].geometry;
    // Set the images to the imageData array
    campground.images = imageData;
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

    const ratingCategories = Review.schema.path('ratingCategory').enumValues;

    res.render('campgrounds/details', {
        campground,
        ratingCategories,
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
    // Get the geoData of the location field of the campground
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();

    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(
        id,
        {
            ...req.body.campground,
        },
        { new: true }
    );

    // Get the images from req.files
    const images = req.files['campground[images]'];

    if (images) {
        const imageData = images.map(image => {
            return { url: image.path, filename: image.filename };
        });
        // spread the array since we just want to update only the items
        campground.images.push(...imageData);
    }

    // Add the geometry data to the model
    campground.geometry = geoData.body.features[0].geometry;

    await campground.save();

    // Delete the images that were marked for deletion in the update form
    // This pulls the elements from the images array of the model that we pass
    // in the deleteImages array in req.body
    if (req.body.deleteImages) {
        // Delete the images from cloudinary
        for (const image of req.body.deleteImages) {
            await cloudinary.uploader.destroy(image);
        }

        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }

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
