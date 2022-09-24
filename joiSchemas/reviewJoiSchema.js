const Joi = require('joi');

const reviewSchema = Joi.object({
    review: Joi.object()
        .keys({
            body: Joi.string().required(),
            rating: Joi.number().required().min(1).max(5),
            ratingCategory: Joi.string().required(),
        })
        .required(),
});

module.exports = reviewSchema;
