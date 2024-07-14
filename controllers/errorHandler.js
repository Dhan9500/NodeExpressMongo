const AppError = require('../utils/appError');

const handleCastDbError = (errs) => {
    const message = `Invalid ${errs.path}: ${errs.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDb = (errs) => {
    const value = errs.errorResponse.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};
const handleValidationError = (errs) => {
    const errors = Object.values(errs.errors).map((el) => el.message);
    const message = `Invalid Input Data: ${errors.join(`. `)}`;
    return new AppError(message, 404);
};
const handleJwtTokenError = () => new AppError('Invalid token! Please log in again..', 401);
const handleJwtTokenExpired = () =>
    new AppError('Your token has been expired! Please log in again..', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stackTrace: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational , trusted error: send meessage to client (which is created by us.)
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming or any other error: don't leak error details.
    } else {
        // 1) Log error
        console.error(err);
        // 2) Send the very generic error to the client.
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong.',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'failed';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastDbError(err);
        if (err.code === 11000) err = handleDuplicateFieldsDb(err);
        if (err.name === 'ValidationError') err = handleValidationError(err);
        if (err.name === 'JsonWebTokenError') err = handleJwtTokenError();
        if (err.name === 'TokenExpiredError') err = handleJwtTokenExpired();
        sendErrorProd(err, res);
    }
    next();
};
