const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const { getPeriodDates, getPreviousPeriodDates } = require('../utils/helpers');

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/v1/insights
 * @desc    Get prioritized insight based on spending patterns
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const { period = 'month', division } = req.query;
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { startDate, endDate } = getPeriodDates(period);
        const { startDate: prevStart, endDate: prevEnd } = getPreviousPeriodDates(period);

        // Build match query
        const matchQuery = {
            userId,
            isDeleted: false,
            date: { $gte: startDate, $lte: endDate }
        };
        if (division && division !== 'all') {
            matchQuery.division = division;
        }

        // Get current period totals by category
        const categoryTotals = await Transaction.aggregate([
            { $match: { ...matchQuery, type: 'expense' } },
            {
                $group: {
                    _id: '$categoryId',
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]);

        // Get current vs previous period comparison
        const currentTotal = await Transaction.aggregate([
            { $match: { ...matchQuery, type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const prevMatchQuery = { ...matchQuery, date: { $gte: prevStart, $lte: prevEnd } };
        const prevTotal = await Transaction.aggregate([
            { $match: { ...prevMatchQuery, type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Check budget status
        const budgets = await Budget.find({ userId, period }).populate('categoryId', 'name');
        const exceededBudgets = [];
        const warningBudgets = [];

        for (const budget of budgets) {
            const spent = await Transaction.aggregate([
                {
                    $match: {
                        userId,
                        categoryId: budget.categoryId._id,
                        type: 'expense',
                        isDeleted: false,
                        date: { $gte: startDate, $lte: endDate }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            const spentAmount = spent[0]?.total || 0;
            const percentage = (spentAmount / budget.amount) * 100;

            if (percentage >= 100) {
                exceededBudgets.push({ category: budget.categoryId.name, percentage: Math.round(percentage) });
            } else if (percentage >= 80) {
                warningBudgets.push({ category: budget.categoryId.name, percentage: Math.round(percentage) });
            }
        }

        // Generate insight based on priority
        let insight = null;

        // Priority 1: Exceeded budgets
        if (exceededBudgets.length > 0) {
            const budget = exceededBudgets[0];
            insight = {
                type: 'warning',
                severity: 'high',
                message: `You've exceeded your ${budget.category} budget by ${budget.percentage - 100}%`,
                icon: '⚠️'
            };
        }
        // Priority 2: Warning budgets
        else if (warningBudgets.length > 0) {
            const budget = warningBudgets[0];
            insight = {
                type: 'warning',
                severity: 'medium',
                message: `You've used ${budget.percentage}% of your ${budget.category} budget`,
                icon: '📊'
            };
        }
        // Priority 3: Spending comparison
        else if (currentTotal[0] && prevTotal[0]) {
            const current = currentTotal[0].total;
            const prev = prevTotal[0].total;
            const percentChange = ((current - prev) / prev) * 100;

            if (percentChange > 20) {
                insight = {
                    type: 'info',
                    severity: 'medium',
                    message: `Spending is up ${Math.round(percentChange)}% compared to last ${period}`,
                    icon: '📈'
                };
            } else if (percentChange < -20) {
                insight = {
                    type: 'success',
                    severity: 'low',
                    message: `Great! Spending is down ${Math.abs(Math.round(percentChange))}% from last ${period}`,
                    icon: '🎉'
                };
            }
        }
        // Priority 4: Top category
        else if (categoryTotals.length > 0) {
            const topCategory = await Transaction.populate(categoryTotals[0], { path: '_id', select: 'name emoji' });
            if (topCategory._id) {
                insight = {
                    type: 'info',
                    severity: 'low',
                    message: `${topCategory._id.emoji || '💰'} ${topCategory._id.name} is your top spending category`,
                    icon: '💡'
                };
            }
        }

        // Fallback insight
        if (!insight) {
            insight = {
                type: 'info',
                severity: 'low',
                message: 'Keep tracking your expenses to see personalized insights',
                icon: '💡'
            };
        }

        res.json({
            success: true,
            data: {
                insight,
                period,
                division: division || 'all'
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
