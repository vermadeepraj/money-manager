/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent JSON format
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(`[ERROR] ${new Date().toISOString()}`, {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let code = err.code || 'SERVER_ERROR';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        const messages = Object.values(err.errors).map(e => e.message);
        message = messages.join(', ');
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        code = 'INVALID_ID';
        message = 'Invalid ID format';
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        code = 'CONFLICT';
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        code = 'INVALID_TOKEN';
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        code = 'TOKEN_EXPIRED';
        message = 'Token has expired';
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error: {
            message: process.env.NODE_ENV === 'production' && statusCode === 500
                ? 'Something went wrong'
                : message,
            code,
            statusCode
        }
    });
};

module.exports = errorHandler;
