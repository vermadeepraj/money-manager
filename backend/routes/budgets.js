const express = require('express');
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBudgetSchema, updateBudgetSchema } = require('../utils/schemas');
const { getPeriodDates } = require('../utils/helpers');

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/v1/budgets
 * @desc    Get all budgets with spending info
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const { period = 'monthly' } = req.query;
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        // Get period dates for spending calculation
        const periodType = period === 'weekly' ? 'week' : 'month';
        const { startDate, endDate } = getPeriodDates(periodType);

        // Get all user budgets with category info
        const budgets = await Budget.find({ userId: req.user.userId })
            .populate('categoryId', 'name emoji type')
            .lean();

        // Calculate spending for each budget
        const budgetsWithSpending = await Promise.all(
            budgets.map(async (budget) => {
                // Get total spending for this category in current period
                const spending = await Transaction.aggregate([
                    {
                        $match: {
                            userId,
                            categoryId: budget.categoryId._id,
                            type: 'expense',
                            isDeleted: false,
                            date: { $gte: startDate, $lte: endDate }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' }
                        }
                    }
                ]);

                const spent = spending[0]?.total || 0;
                const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

                // Determine status
                let status = 'normal';
                if (percentage >= 100) status = 'exceeded';
                else if (percentage >= 80) status = 'warning';

                return {
                    ...budget,
                    spent,
                    percentage: Math.round(percentage * 10) / 10,
                    remaining: Math.max(0, budget.amount - spent),
                    status
                };
            })
        );

        res.json({
            success: true,
            data: {
                budgets: budgetsWithSpending,
                period: periodType
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/budgets
 * @desc    Create or update budget for a category
 * @access  Private
 */
router.post('/', validate(createBudgetSchema), async (req, res, next) => {
    try {
        const { categoryId, amount, period = 'monthly' } = req.body;

        // Check if budget already exists for this category
        let budget = await Budget.findOne({
            userId: req.user.userId,
            categoryId
        });

        if (budget) {
            // Update existing budget
            budget.amount = amount;
            budget.period = period;
            await budget.save();
        } else {
            // Create new budget
            budget = await Budget.create({
                userId: req.user.userId,
                categoryId,
                amount,
                period
            });
        }

        await budget.populate('categoryId', 'name emoji type');

        res.status(budget.isNew ? 201 : 200).json({
            success: true,
            data: {
                budget
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/v1/budgets/:id
 * @desc    Update budget amount
 * @access  Private
 */
router.put('/:id', validate(updateBudgetSchema), async (req, res, next) => {
    try {
        const budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Budget not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        if (req.body.amount !== undefined) budget.amount = req.body.amount;
        if (req.body.period !== undefined) budget.period = req.body.period;

        await budget.save();
        await budget.populate('categoryId', 'name emoji type');

        res.json({
            success: true,
            data: {
                budget
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/v1/budgets/:id
 * @desc    Delete budget
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Budget not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        res.json({
            success: true,
            data: {
                message: 'Budget deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
