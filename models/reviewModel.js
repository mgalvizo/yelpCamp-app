const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    rating: {
        type: Number,
    },
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;
