// The class handles only Operational Errors
// Extend the built-in error object
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Create stack property on a target object
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
