const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    rating: {
        type: Number,
    },
    ratingCategory: {
        type: String,
        enum: ['Terrible', 'Not good', 'Average', 'Very good', 'Amazing'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
