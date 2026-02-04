/**
 * Multer configuration for file uploads
 * Handles profile picture uploads with validation
 */
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Storage configuration for profile pictures
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/profiles'));
    },
    filename: function (req, file, cb) {
        // Generate unique filename: userId-uuid.extension
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `${req.user.userId}-${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

// File filter for images only
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

// Profile picture upload middleware
const uploadProfilePicture = multer({
    storage: profileStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max
        files: 1
    }
});

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'File too large. Maximum size is 2MB.',
                    code: 'FILE_TOO_LARGE',
                    statusCode: 400
                }
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Too many files. Only one file is allowed.',
                    code: 'TOO_MANY_FILES',
                    statusCode: 400
                }
            });
        }
        return res.status(400).json({
            success: false,
            error: {
                message: err.message,
                code: 'UPLOAD_ERROR',
                statusCode: 400
            }
        });
    }
    
    if (err) {
        return res.status(400).json({
            success: false,
            error: {
                message: err.message || 'File upload failed',
                code: 'UPLOAD_ERROR',
                statusCode: 400
            }
        });
    }
    
    next();
};

module.exports = {
    uploadProfilePicture,
    handleMulterError
};
