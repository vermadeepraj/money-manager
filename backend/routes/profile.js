const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadProfilePicture, handleMulterError } = require('../middleware/upload');
const { 
    updateProfileSchema, 
    changePasswordSchema, 
    changeEmailSchema,
    SUPPORTED_CURRENCIES 
} = require('../utils/schemas');

const router = express.Router();

/**
 * @route   GET /api/v1/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', auth, async (req, res, next) => {
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
                profile: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    profilePicture: user.profilePicture,
                    currency: user.currency,
                    defaultDivision: user.defaultDivision,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/v1/profile
 * @desc    Update user profile (name, currency, defaultDivision)
 * @access  Private
 */
router.put('/', auth, validate(updateProfileSchema), async (req, res, next) => {
    try {
        const { name, currency, defaultDivision } = req.body;

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

        // Update fields if provided
        if (name !== undefined) user.name = name;
        if (currency !== undefined) user.currency = currency;
        if (defaultDivision !== undefined) user.defaultDivision = defaultDivision;

        await user.save();

        res.json({
            success: true,
            data: {
                profile: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    profilePicture: user.profilePicture,
                    currency: user.currency,
                    defaultDivision: user.defaultDivision,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/profile/photo
 * @desc    Upload profile picture
 * @access  Private
 */
router.post('/photo', auth, uploadProfilePicture.single('photo'), handleMulterError, async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'No file uploaded',
                    code: 'NO_FILE',
                    statusCode: 400
                }
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            // Delete uploaded file if user not found
            fs.unlink(req.file.path, () => {});
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        // Delete old profile picture if exists
        if (user.profilePicture) {
            const oldPath = path.join(__dirname, '../uploads/profiles', path.basename(user.profilePicture));
            fs.unlink(oldPath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Error deleting old profile picture:', err);
                }
            });
        }

        // Save new profile picture path (relative URL for frontend)
        user.profilePicture = `/uploads/profiles/${req.file.filename}`;
        await user.save();

        res.json({
            success: true,
            data: {
                profilePicture: user.profilePicture,
                message: 'Profile picture uploaded successfully'
            }
        });
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        next(error);
    }
});

/**
 * @route   DELETE /api/v1/profile/photo
 * @desc    Remove profile picture
 * @access  Private
 */
router.delete('/photo', auth, async (req, res, next) => {
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

        if (!user.profilePicture) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'No profile picture to remove',
                    code: 'NO_PHOTO',
                    statusCode: 400
                }
            });
        }

        // Delete the file
        const filePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profilePicture));
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error deleting profile picture:', err);
            }
        });

        // Remove from database
        user.profilePicture = null;
        await user.save();

        res.json({
            success: true,
            data: {
                message: 'Profile picture removed successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/v1/profile/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', auth, validate(changePasswordSchema), async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.userId).select('+password');

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

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Current password is incorrect',
                    code: 'INVALID_PASSWORD',
                    statusCode: 401
                }
            });
        }

        // Check if new password is same as old
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'New password must be different from current password',
                    code: 'SAME_PASSWORD',
                    statusCode: 400
                }
            });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            data: {
                message: 'Password changed successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/profile/email
 * @desc    Request email change (sends verification to new email)
 * @access  Private
 */
router.post('/email', auth, validate(changeEmailSchema), async (req, res, next) => {
    try {
        const { newEmail, password } = req.body;

        // Get user with password
        const user = await User.findById(req.user.userId).select('+password');

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

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Password is incorrect',
                    code: 'INVALID_PASSWORD',
                    statusCode: 401
                }
            });
        }

        // Check if email is same as current
        if (newEmail.toLowerCase() === user.email) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'New email must be different from current email',
                    code: 'SAME_EMAIL',
                    statusCode: 400
                }
            });
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: {
                    message: 'This email is already in use',
                    code: 'EMAIL_EXISTS',
                    statusCode: 409
                }
            });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

        // Save pending email and token
        user.pendingEmail = newEmail.toLowerCase();
        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // TODO: Send verification email with nodemailer
        // For now, we'll return the token in development mode
        const responseData = {
            message: 'Verification email sent. Please check your inbox.',
            pendingEmail: newEmail
        };

        // In development, include token for testing
        if (process.env.NODE_ENV === 'development') {
            responseData.verificationToken = verificationToken;
            responseData.verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        }

        res.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/v1/profile/verify-email/:token
 * @desc    Verify new email address
 * @access  Public
 */
router.get('/verify-email/:token', async (req, res, next) => {
    try {
        const { token } = req.params;

        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() }
        }).select('+emailVerificationToken +emailVerificationExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Invalid or expired verification token',
                    code: 'INVALID_TOKEN',
                    statusCode: 400
                }
            });
        }

        if (!user.pendingEmail) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'No pending email change request',
                    code: 'NO_PENDING_EMAIL',
                    statusCode: 400
                }
            });
        }

        // Update email
        user.email = user.pendingEmail;
        user.pendingEmail = null;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        user.isEmailVerified = true;
        await user.save();

        res.json({
            success: true,
            data: {
                message: 'Email changed successfully',
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/v1/profile/currencies
 * @desc    Get list of supported currencies
 * @access  Public
 */
router.get('/currencies', (req, res) => {
    const currencyDetails = {
        INR: { name: 'Indian Rupee', symbol: '₹' },
        USD: { name: 'US Dollar', symbol: '$' },
        EUR: { name: 'Euro', symbol: '€' },
        GBP: { name: 'British Pound', symbol: '£' },
        JPY: { name: 'Japanese Yen', symbol: '¥' },
        AUD: { name: 'Australian Dollar', symbol: 'A$' },
        CAD: { name: 'Canadian Dollar', symbol: 'C$' },
        CHF: { name: 'Swiss Franc', symbol: 'CHF' },
        CNY: { name: 'Chinese Yuan', symbol: '¥' },
        SGD: { name: 'Singapore Dollar', symbol: 'S$' }
    };

    const currencies = SUPPORTED_CURRENCIES.map(code => ({
        code,
        ...currencyDetails[code]
    }));

    res.json({
        success: true,
        data: { currencies }
    });
});

module.exports = router;
