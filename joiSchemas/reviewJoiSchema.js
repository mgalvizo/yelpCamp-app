const Joi = require('joi');

const reviewSchema = Joi.object({
    review: Joi.object()
        .keys({
            body: Joi.string().required(),
            rating: Joi.number().required().min(0).max(5),
        })
        .required(),
});

module.exports = reviewSchema;
