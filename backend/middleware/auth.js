const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies the token from Authorization header and attaches userId to request
 */
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Access denied. No token provided.',
                    code: 'UNAUTHORIZED',
                    statusCode: 401
                }
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Token has expired. Please login again.',
                    code: 'TOKEN_EXPIRED',
                    statusCode: 401
                }
            });
        }

        return res.status(401).json({
            success: false,
            error: {
                message: 'Invalid token.',
                code: 'INVALID_TOKEN',
                statusCode: 401
            }
        });
    }
};

module.exports = auth;
