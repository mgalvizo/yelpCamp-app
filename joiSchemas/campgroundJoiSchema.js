const BaseJoi = require('joi');
const extension = require('./joiExtension');

const Joi = BaseJoi.extend(extension);

// Add JOI campground schema (this is not a mongoose schema)
// To test this in POSTMAN you have to set Body to x-www-form-urlencoded
const campgroundSchema = Joi.object({
    campground: Joi.object()
        .keys({
            title: Joi.string().required().escapeHTML(),
            // images: Joi.array().min(1).max(3).items(Joi.string()).required(),
            price: Joi.number().min(0).required(),
            description: Joi.string().required().escapeHTML(),
            location: Joi.string().required().escapeHTML(),
        })
        .required(),
    deleteImages: Joi.array().items(Joi.string()),
});

module.exports = campgroundSchema;
