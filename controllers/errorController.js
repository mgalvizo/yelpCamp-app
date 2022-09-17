const AppError = require('../utilities/appError');

// Function that handles an invalid mongoDB id
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    console.log(message);
    // Don't throw the error since it stops the execution, return it
    // so it is passed to the sendErrorProduction function
    return new AppError(message, 400);
};

// Function that sends the error in development mode
const sendErrorDevelopment = (err, req, res) => {
    console.error('ERROR-DEV!!!', err);

    // Render error template
    return res.status(err.statusCode).render('error', {
        error: err,
        environment: process.env.NODE_ENV,
    });
};

// Function that sends the error in production mode
const sendErrorProduction = (err, req, res) => {
    err.message = err.isOperational ? err.message : 'Please try again later.';

    !err.isOperational && console.error('ERROR', err);

    // Render an error template
    return res.status(err.statusCode).render('error', {
        error: err,
        environment: process.env.NODE_ENV,
    });
};

// Global Error Handling Function that will be used
// In app.js
module.exports = (err, req, res, next) => {
    // default error status and status code
    err.status = err.status || 'fail';
    err.statusCode = err.statusCode || 500;

    // Distinguish errors from production and development
    if (process.env.NODE_ENV === 'development') {
        sendErrorDevelopment(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // Create a copy of the error
        let error = Object.create(err);

        if (error.name === 'CastError') {
            error = handleCastErrorDB(error);
        }

        // Send the error copy
        sendErrorProduction(error, req, res);
    }
};
