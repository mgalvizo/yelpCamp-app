const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// No validation from mongoose since we are using Joi
const campgroundSchema = new Schema({
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
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
