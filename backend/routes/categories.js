const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCategorySchema, updateCategorySchema } = require('../utils/schemas');

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories (defaults + user's custom)
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const { division, type } = req.query;

        // Query for default categories and user's custom categories
        const query = {
            $or: [
                { isDefault: true },
                { userId: req.user.userId }
            ],
            isDeleted: false
        };

        // Apply filters
        if (division && division !== 'all') {
            query.division = division;
        }

        if (type && type !== 'all') {
            query.type = type;
        }

        const categories = await Category.find(query)
            .sort({ isDefault: -1, name: 1 })
            .lean();

        // Group by type for easier frontend usage
        const grouped = {
            income: categories.filter(c => c.type === 'income'),
            expense: categories.filter(c => c.type === 'expense')
        };

        res.json({
            success: true,
            data: {
                categories,
                grouped
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/categories
 * @desc    Create custom category
 * @access  Private
 */
router.post('/', validate(createCategorySchema), async (req, res, next) => {
    try {
        const { name, emoji, type, division } = req.body;

        // Check if category with same name already exists for this user
        const existing = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            userId: req.user.userId,
            isDeleted: false
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: {
                    message: 'Category with this name already exists',
                    code: 'CONFLICT',
                    statusCode: 409
                }
            });
        }

        const category = await Category.create({
            name,
            emoji,
            type,
            division,
            userId: req.user.userId,
            isDefault: false
        });

        res.status(201).json({
            success: true,
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update custom category
 * @access  Private
 */
router.put('/:id', validate(updateCategorySchema), async (req, res, next) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDefault: false,
            isDeleted: false
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Category not found or cannot be edited',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        // Update allowed fields
        const allowedUpdates = ['name', 'emoji', 'type', 'division'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                category[field] = req.body[field];
            }
        });

        await category.save();

        res.json({
            success: true,
            data: {
                category
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Soft delete custom category
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDefault: false,
            isDeleted: false
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Category not found or cannot be deleted',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        // Soft delete
        category.isDeleted = true;
        await category.save();

        res.json({
            success: true,
            data: {
                message: 'Category deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
