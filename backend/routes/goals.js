const express = require('express');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createGoalSchema, updateGoalSchema } = require('../utils/schemas');

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/v1/goals
 * @desc    Get all user goals
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const { status } = req.query;

        const query = {
            userId: req.user.userId,
            isDeleted: false
        };

        if (status === 'active') {
            query.isCompleted = false;
        } else if (status === 'completed') {
            query.isCompleted = true;
        }

        const goals = await Goal.find(query)
            .sort({ targetDate: 1 })
            .lean();

        // Add computed fields
        const goalsWithProgress = goals.map(goal => ({
            ...goal,
            progress: goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 100,
            remainingAmount: Math.max(0, goal.targetAmount - goal.currentAmount),
            daysRemaining: Math.max(0, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)))
        }));

        res.json({
            success: true,
            data: {
                goals: goalsWithProgress
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/goals
 * @desc    Create new goal
 * @access  Private
 */
router.post('/', validate(createGoalSchema), async (req, res, next) => {
    try {
        const { name, targetAmount, currentAmount = 0, targetDate } = req.body;

        const goal = await Goal.create({
            userId: req.user.userId,
            name,
            targetAmount,
            currentAmount,
            targetDate: new Date(targetDate)
        });

        res.status(201).json({
            success: true,
            data: {
                goal
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/v1/goals/:id
 * @desc    Update goal
 * @access  Private
 */
router.put('/:id', validate(updateGoalSchema), async (req, res, next) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDeleted: false
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Goal not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        const allowedUpdates = ['name', 'targetAmount', 'currentAmount', 'targetDate'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                goal[field] = field === 'targetDate' ? new Date(req.body[field]) : req.body[field];
            }
        });

        // Check if goal is completed
        if (goal.currentAmount >= goal.targetAmount) {
            goal.isCompleted = true;
        }

        await goal.save();

        res.json({
            success: true,
            data: {
                goal
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/goals/:id/add
 * @desc    Add amount to goal
 * @access  Private
 */
router.post('/:id/add', async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Amount must be a positive number',
                    code: 'VALIDATION_ERROR',
                    statusCode: 400
                }
            });
        }

        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDeleted: false
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Goal not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        goal.currentAmount += amount;

        // Check if goal is completed
        if (goal.currentAmount >= goal.targetAmount) {
            goal.isCompleted = true;
        }

        await goal.save();

        res.json({
            success: true,
            data: {
                goal
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/v1/goals/:id
 * @desc    Soft delete goal
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDeleted: false
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Goal not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        goal.isDeleted = true;
        await goal.save();

        res.json({
            success: true,
            data: {
                message: 'Goal deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
