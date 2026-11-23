
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid event information.',
            error: err.message
        });
    }

    // Invalid MongoDB ObjectId errors
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format.',
            error: err.message
        });
    }

    // Invalid JSON request body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format in request body.'
        });
    }

    // Unexpected server errors
    res.status(500).json({
        success: false,
        message: 'An unexpected server error occurred.'
    });
};

module.exports = errorHandler;
