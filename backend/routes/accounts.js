const express = require('express');
const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAccountSchema, updateAccountSchema, transferSchema } = require('../utils/schemas');

const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * @route   GET /api/v1/accounts
 * @desc    Get all user accounts
 * @access  Private
 */
router.get('/', async (req, res, next) => {
    try {
        const accounts = await Account.find({
            userId: req.user.userId,
            isDeleted: false
        }).sort({ name: 1 }).lean();

        // Calculate total balance
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        res.json({
            success: true,
            data: {
                accounts,
                totalBalance
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/accounts
 * @desc    Create new account
 * @access  Private
 */
router.post('/', validate(createAccountSchema), async (req, res, next) => {
    try {
        const { name, type, balance = 0 } = req.body;

        // Check if account with same name exists
        const existing = await Account.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            userId: req.user.userId,
            isDeleted: false
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: {
                    message: 'Account with this name already exists',
                    code: 'CONFLICT',
                    statusCode: 409
                }
            });
        }

        const account = await Account.create({
            userId: req.user.userId,
            name,
            type,
            balance
        });

        res.status(201).json({
            success: true,
            data: {
                account
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/v1/accounts/:id
 * @desc    Update account
 * @access  Private
 */
router.put('/:id', validate(updateAccountSchema), async (req, res, next) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
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

        const allowedUpdates = ['name', 'type', 'balance'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                account[field] = req.body[field];
            }
        });

        await account.save();

        res.json({
            success: true,
            data: {
                account
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/v1/accounts/:id
 * @desc    Soft delete account
 * @access  Private
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
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

        // Soft delete
        account.isDeleted = true;
        await account.save();

        res.json({
            success: true,
            data: {
                message: 'Account deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/v1/accounts/transfer
 * @desc    Transfer between accounts (creates two linked transactions)
 * @access  Private
 */
router.post('/transfer', validate(transferSchema), async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fromAccountId, toAccountId, amount, description, date } = req.body;

        // Verify accounts exist and belong to user
        const [fromAccount, toAccount] = await Promise.all([
            Account.findOne({ _id: fromAccountId, userId: req.user.userId, isDeleted: false }),
            Account.findOne({ _id: toAccountId, userId: req.user.userId, isDeleted: false })
        ]);

        if (!fromAccount || !toAccount) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                error: {
                    message: 'One or both accounts not found',
                    code: 'NOT_FOUND',
                    statusCode: 404
                }
            });
        }

        if (fromAccountId === toAccountId) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Cannot transfer to the same account',
                    code: 'VALIDATION_ERROR',
                    statusCode: 400
                }
            });
        }

        // Get or create transfer category
        let transferCategory = await Category.findOne({ name: 'Transfer', isDefault: true });
        if (!transferCategory) {
            transferCategory = await Category.create({
                name: 'Transfer',
                emoji: '🔄',
                type: 'expense',
                division: 'personal',
                isDefault: true
            });
        }

        // Create withdrawal transaction (from source account)
        const withdrawal = await Transaction.create([{
            userId: req.user.userId,
            type: 'transfer',
            amount: amount,
            categoryId: transferCategory._id,
            description: description || `Transfer to ${toAccount.name}`,
            date: new Date(date),
            division: 'personal',
            accountId: fromAccountId
        }], { session });

        // Create deposit transaction (to destination account)
        const deposit = await Transaction.create([{
            userId: req.user.userId,
            type: 'transfer',
            amount: amount,
            categoryId: transferCategory._id,
            description: description || `Transfer from ${fromAccount.name}`,
            date: new Date(date),
            division: 'personal',
            accountId: toAccountId,
            linkedTransactionId: withdrawal[0]._id
        }], { session });

        // Update withdrawal with linked ID
        await Transaction.findByIdAndUpdate(
            withdrawal[0]._id,
            { linkedTransactionId: deposit[0]._id },
            { session }
        );

        // Update account balances
        await Account.findByIdAndUpdate(
            fromAccountId,
            { $inc: { balance: -amount } },
            { session }
        );

        await Account.findByIdAndUpdate(
            toAccountId,
            { $inc: { balance: amount } },
            { session }
        );

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            data: {
                message: 'Transfer completed successfully',
                withdrawal: withdrawal[0],
                deposit: deposit[0]
            }
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
});

module.exports = router;
