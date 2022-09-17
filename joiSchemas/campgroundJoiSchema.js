const Joi = require('joi');

// Add JOI campground schema (this is not a mongoose schema)
// To test this in POSTMAN you have to set Body to x-www-form-urlencoded
const campgroundSchema = Joi.object({
    campground: Joi.object()
        .keys({
            title: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string().required(),
            location: Joi.string().required(),
        })
        .required(),
});

module.exports = campgroundSchema;
