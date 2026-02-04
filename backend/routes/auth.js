const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../utils/schemas');

const router = express.Router();

// Default accounts to create for new users (per database-design.md)
const defaultAccounts = [
    { name: 'Cash', type: 'cash', balance: 0 },
    { name: 'Bank Account', type: 'bank', balance: 0 }
];

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: {
                    message: 'User with this email already exists',
                    code: 'CONFLICT',
                    statusCode: 409
                }
            });
        }

        // Create new user
        const user = await User.create({ email, password, name });

        // Create default accounts for the new user
        await Account.insertMany(
            defaultAccounts.map(acc => ({
                ...acc,
                userId: user._id
            }))
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', validate(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid email or password',
                    code: 'UNAUTHORIZED',
                    statusCode: 401
                }
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid email or password',
                    code: 'UNAUTHORIZED',
                    statusCode: 401
                }
            });
        }

        // Generate access token (short-lived)
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                token: accessToken
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token from httpOnly cookie
 * @access  Public (but requires valid refresh token cookie)
 */
router.post('/refresh', async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'No refresh token provided',
                    code: 'NO_REFRESH_TOKEN',
                    statusCode: 401
                }
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'User no longer exists',
                    code: 'USER_NOT_FOUND',
                    statusCode: 401
                }
            });
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate new refresh token
        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set new refresh token as httpOnly cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            data: {
                accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            }
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            // Clear invalid refresh token cookie
            res.clearCookie('refreshToken');
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid or expired refresh token',
                    code: 'INVALID_REFRESH_TOKEN',
                    statusCode: 401
                }
            });
        }
        next(error);
    }
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout and clear refresh token cookie
 * @access  Public
 */
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.json({
        success: true,
        data: {
            message: 'Logged out successfully'
        }
    });
});

module.exports = router;

