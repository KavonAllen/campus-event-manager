
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check whether an authorization token was provided
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Authentication token required.'
        });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired authentication token.'
            });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
