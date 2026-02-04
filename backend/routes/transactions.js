const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Account = require('../models/Account');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTransactionSchema, updateTransactionSchema } = require('../utils/schemas');
const { canModifyTransaction, getPeriodDates, getPreviousPeriodDates } = require('../utils/helpers');

const router = express.Router();

/**
 * Helper function to update account balance based on transaction type
 * @param {string} accountId - Account ID to update
 * @param {number} amount - Transaction amount
 * @param {string} type - Transaction type (income/expense/transfer)
 * @param {string} operation - 'add' or 'subtract' (for create/delete operations)
 */
async function updateAccountBalance(accountId, amount, type, operation = 'add') {
    if (!accountId) return;

    let balanceChange = 0;

    if (type === 'income') {
        balanceChange = operation === 'add' ? amount : -amount;
    } else if (type === 'expense') {
        balanceChange = operation === 'add' ? -amount : amount;
    }
    // Note: 'transfer' type is handled separately with source/destination accounts

    if (balanceChange !== 0) {
        await Account.findByIdAndUpdate(accountId, {
            $inc: { balance: balanceChange }
        });
    }
}

/**
 * Helper function to reverse old transaction's effect on account balance
 * and apply new transaction's effect (for updates)
 */
async function adjustAccountBalanceForUpdate(oldTransaction, newTransaction) {
    const oldAccountId = oldTransaction.accountId?.toString();
    const newAccountId = newTransaction.accountId?.toString();
    const accountChanged = oldAccountId !== newAccountId;

    // If account changed, reverse effect on old account and apply to new account
    if (accountChanged) {
        // Reverse old transaction effect on old account
        if (oldAccountId) {
            await updateAccountBalance(oldAccountId, oldTransaction.amount, oldTransaction.type, 'subtract');
        }
        // Apply new transaction effect on new account
        if (newAccountId) {
            await updateAccountBalance(newAccountId, newTransaction.amount, newTransaction.type, 'add');
        }
    } else if (oldAccountId) {
        // Same account - calculate net change
        let oldEffect = oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
        let newEffect = newTransaction.type === 'income' ? newTransaction.amount : -newTransaction.amount;
        let netChange = newEffect - oldEffect;

        if (netChange !== 0) {
            await Account.findByIdAndUpdate(oldAccountId, {
                $inc: { balance: netChange }
            });
        }
    }
}

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/v1/transactions
 * @desc    Get all transactions (paginated, filtered)
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            sort = '-date',
            search,
            division,
            category,
            type,
            startDate,
            endDate
        } = req.query;

        // Build query
        const query = {
            userId: req.user.userId,
            isDeleted: false
        };

        // Apply filters
        if (division && division !== 'all') {
            query.division = division;
        }

        if (category && category !== 'all') {
            query.categoryId = category;
        }

        if (type && type !== 'all') {
            query.type = type;
        }

        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Build sort object
        const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        const sortObj = { [sortField]: sortOrder };

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [transactions, total] = await Promise.all([
            Transaction.find(query)
                .populate('categoryId', 'name emoji type')
                .populate('accountId', 'name type')
                .sort(sortObj)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Transaction.countDocuments(query)
        ]);

        // Add canEdit flag to each transaction
        const transactionsWithEdit = transactions.map(t => ({
            ...t,
            canEdit: canModifyTransaction(t.createdAt)
        }));

        const pages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: {
                transactions: transactionsWithEdit,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages,
                    hasNext: parseInt(page) < pages,
                    hasPrev: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
});
/**
 * @route   GET /api/v1/transactions/summary
 * @desc    Get transaction summary stats
 * @access  Private
 */
router.get('/summary', async (req, res, next) => {
    try {
        const { period = 'month', division } = req.query;
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const { startDate, endDate } = getPeriodDates(period);
        const { startDate: prevStart, endDate: prevEnd } = getPreviousPeriodDates(period);

        // Build match query
        const matchQuery = {
            userId,
            isDeleted: false,
            date: { $gte: startDate, $lte: endDate },
            type: { $in: ['income', 'expense'] }
        };

        const prevMatchQuery = {
            userId,
            isDeleted: false,
            date: { $gte: prevStart, $lte: prevEnd },
            type: { $in: ['income', 'expense'] }
        };

        // Apply division filter if present
        if (division && division !== 'all') {
            matchQuery.division = division;
            prevMatchQuery.division = division;
        }

        // Current period summary
        const summary = await Transaction.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Previous period summary (for comparison)
        const prevSummary = await Transaction.aggregate([
            { $match: prevMatchQuery },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // Parse results
        const income = summary.find(s => s._id === 'income')?.total || 0;
        const expense = summary.find(s => s._id === 'expense')?.total || 0;
        const balance = income - expense;
        const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;

        const prevIncome = prevSummary.find(s => s._id === 'income')?.total || 0;
        const prevExpense = prevSummary.find(s => s._id === 'expense')?.total || 0;

        // Calculate trends (percentage change)
        const incomeTrend = prevIncome > 0 ? ((income - prevIncome) / prevIncome * 100).toFixed(1) : 0;
        const expenseTrend = prevExpense > 0 ? ((expense - prevExpense) / prevExpense * 100).toFixed(1) : 0;

        res.json({
            success: true,
            data: {
                income,
                expense,
                balance,
                savingsRate: parseFloat(savingsRate),
                trends: {
                    income: parseFloat(incomeTrend),
                    expense: parseFloat(expenseTrend)
                },
                period,
                dateRange: { startDate, endDate }
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/v1/transactions/category-breakdown
 * @desc    Get expense breakdown by category (for donut chart)
 * @access  Private
 */
router.get('/category-breakdown', async (req, res, next) => {
    try {
        const { period = 'month', type = 'expense' } = req.query;
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { startDate, endDate } = getPeriodDates(period);

        const breakdown = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    isDeleted: false,
                    type,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$categoryId',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    name: '$category.name',
                    emoji: '$category.emoji',
                    total: 1,
                    count: 1
                }
            },
            { $sort: { total: -1 } }
        ]);

        // Calculate percentages
        const grandTotal = breakdown.reduce((sum, item) => sum + item.total, 0);
        const breakdownWithPercentage = breakdown.map(item => ({
            ...item,
            percentage: grandTotal > 0 ? ((item.total / grandTotal) * 100).toFixed(1) : 0
        }));

        res.json({
            success: true,
            data: {
                breakdown: breakdownWithPercentage,
                total: grandTotal,
                period
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/v1/transactions/trend
 * @desc    Get daily trend data (for line chart)
 * @access  Private
 */
router.get('/trend', async (req, res, next) => {
    try {
        const { period = 'month' } = req.query;
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const { startDate, endDate } = getPeriodDates(period);

        const trend = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    isDeleted: false,
                    date: { $gte: startDate, $lte: endDate },
                    type: { $in: ['income', 'expense'] }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    income: {
                        $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
                    },
                    expense: {
                        $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
                    }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    income: 1,
                    expense: 1,
                    net: { $subtract: ['$income', '$expense'] }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                trend,
                period
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/v1/transactions/export
 * @desc    Export filtered transactions to CSV
 * @access  Private
 */
router.get('/export', async (req, res, next) => {
    try {
        const { division, category, type, startDate, endDate } = req.query;

        // Build query (same as list endpoint)
        const query = {
            userId: req.user.userId,
            isDeleted: false
        };

        if (division && division !== 'all') query.division = division;
        if (category && category !== 'all') query.categoryId = category;
        if (type && type !== 'all') query.type = type;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Fetch all matching transactions (no pagination for export)
        const transactions = await Transaction.find(query)
            .populate('categoryId', 'name emoji')
            .populate('accountId', 'name')
            .sort({ date: -1 })
            .lean();

        // Build CSV content
        const headers = ['Date', 'Type', 'Amount', 'Category', 'Description', 'Division', 'Account'];
        const rows = transactions.map(t => [
            new Date(t.date).toISOString().split('T')[0],
            t.type,
            t.amount,
            t.categoryId ? `${t.categoryId.emoji} ${t.categoryId.name}` : '',
            `"${(t.description || '').replace(/"/g, '""')}"`, // Escape quotes in CSV
            t.division,
            t.accountId ? t.accountId.name : ''
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Set headers for file download
        const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/transactions
 * @desc    Create new transaction
 * @access  Private
 */
router.post('/', validate(createTransactionSchema), async (req, res, next) => {
    try {
        const { type, amount, categoryId, description, date, division, accountId } = req.body;

        // Verify category exists
        const category = await Category.findById(categoryId);
        if (!category || category.isDeleted) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Category not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        // Verify account exists if provided
        if (accountId) {
            const account = await Account.findOne({
                _id: accountId,
                userId: req.user.userId,
                isDeleted: false
            });
            if (!account) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Account not found',
                        code: 'NOT_FOUND',
                        statusCode: 404
                    }
                });
            }
        }

        const transaction = await Transaction.create({
            userId: req.user.userId,
            type,
            amount,
            categoryId,
            description,
            date: new Date(date),
            division,
            accountId
        });

        // Update account balance
        await updateAccountBalance(accountId, amount, type, 'add');

        // Populate category and account for response
        await transaction.populate('categoryId', 'name emoji type');
        await transaction.populate('accountId', 'name type balance');

        res.status(201).json({
            success: true,
            data: {
                transaction
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/v1/transactions/:id
 * @desc    Update transaction (12hr limit)
 * @access  Private
 */
router.put('/:id', validate(updateTransactionSchema), async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDeleted: false
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Transaction not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        // Check 12-hour edit restriction
        if (!canModifyTransaction(transaction.createdAt)) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'Cannot modify transactions older than 12 hours',
                    code: 'EDIT_WINDOW_EXPIRED',
                    statusCode: 403
                }
            });
        }

        // Store old values for balance adjustment
        const oldTransaction = {
            accountId: transaction.accountId,
            amount: transaction.amount,
            type: transaction.type
        };

        // Update fields
        const allowedUpdates = ['type', 'amount', 'categoryId', 'description', 'date', 'division', 'accountId'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                transaction[field] = field === 'date' ? new Date(req.body[field]) : req.body[field];
            }
        });

        await transaction.save();

        // Adjust account balance based on changes
        const newTransaction = {
            accountId: transaction.accountId,
            amount: transaction.amount,
            type: transaction.type
        };
        await adjustAccountBalanceForUpdate(oldTransaction, newTransaction);

        await transaction.populate('categoryId', 'name emoji type');
        await transaction.populate('accountId', 'name type balance');

        res.json({
            success: true,
            data: {
                transaction
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/v1/transactions/:id
 * @desc    Soft delete transaction (12hr limit)
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDeleted: false
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Transaction not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        // Check 12-hour edit restriction
        if (!canModifyTransaction(transaction.createdAt)) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'Cannot delete transactions older than 12 hours',
                    code: 'EDIT_WINDOW_EXPIRED',
                    statusCode: 403
                }
            });
        }

        // Reverse the account balance effect
        await updateAccountBalance(transaction.accountId, transaction.amount, transaction.type, 'subtract');

        // Soft delete
        transaction.isDeleted = true;
        transaction.deletedAt = new Date();
        await transaction.save();

        res.json({
            success: true,
            data: {
                message: 'Transaction deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PATCH /api/v1/transactions/:id/restore
 * @desc    Restore a soft-deleted transaction (for undo)
 * @access  Private
 */
router.patch('/:id/restore', async (req, res, next) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user.userId,
            isDeleted: true
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Deleted transaction not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        // Only allow restore within 30 seconds of deletion (undo window)
        const timeSinceDelete = Date.now() - new Date(transaction.deletedAt).getTime();
        const maxUndoWindow = 30 * 1000; // 30 seconds

        if (timeSinceDelete > maxUndoWindow) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'Undo window expired. Transaction cannot be restored.',
                    code: 'UNDO_EXPIRED',
                    statusCode: 403
                }
            });
        }

        // Restore the transaction
        transaction.isDeleted = false;
        transaction.deletedAt = null;
        await transaction.save();

        // Re-apply the account balance effect
        await updateAccountBalance(transaction.accountId, transaction.amount, transaction.type, 'add');

        await transaction.populate('categoryId', 'name emoji type');
        await transaction.populate('accountId', 'name type balance');

        res.json({
            success: true,
            data: {
                transaction,
                message: 'Transaction restored successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
