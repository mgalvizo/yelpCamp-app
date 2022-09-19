const mongoose = require('mongoose');
const Review = require('../models/reviewModel');

// No validation from mongoose since we are using Joi
const campgroundSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    reviews: [
        // Array of ObjectId, 1 to Many relationship
        {
            type: mongoose.Schema.Types.ObjectId,
            // Review model
            ref: 'Review',
        },
    ],
});

// Query middleware that deletes a campground and the reviews
// associated with it.
// We have access to the campground even after deletion.
campgroundSchema.post('findOneAndDelete', async function (doc) {
    // Delete the reviews from the deleted campground
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
