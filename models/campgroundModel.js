const mongoose = require('mongoose');
const Review = require('../models/reviewModel');

// Define new Image schema and nest it
const imageSchema = new mongoose.Schema({
    url: {
        type: String,
    },
    filename: {
        type: String,
    },
});

// Set a thumbnail virtual property in the schema that adds a w_200 to the url
// so a thumb image can be displayed and we don't have to store that data in mongo
// We will have access to a .thumbnail property because of the "get" in the virtual
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_250');
});

// No validation from mongoose since we are using Joi
const campgroundSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    // Array of images
    images: [imageSchema],
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
