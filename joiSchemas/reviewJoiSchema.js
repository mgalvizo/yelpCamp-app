const BaseJoi = require('joi');
const extension = require('./joiExtension');

const Joi = BaseJoi.extend(extension);

const reviewSchema = Joi.object({
    review: Joi.object()
        .keys({
            body: Joi.string().required().escapeHTML(),
            rating: Joi.number().required().min(1).max(5),
            ratingCategory: Joi.string().required().escapeHTML(),
        })
        .required(),
});

module.exports = reviewSchema;
