const sanitizeHtml = require('sanitize-html');
// Extension of joi that sanitizes user input to strip html tags from it
// and avoid script injections
const extension = joi => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!',
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                // Use the sanitize package with the options
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error('string.escapeHTML', { value });
                return clean;
            },
        },
    },
});

module.exports = extension;
