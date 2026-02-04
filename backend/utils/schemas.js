const { z } = require('zod');

// ============ AUTH SCHEMAS ============
const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

// Helper: accepts both "2026-02-04" and "2026-02-04T00:00:00.000Z" formats
const dateString = z.string().refine((val) => {
    // Try parsing as date - accepts YYYY-MM-DD or full ISO datetime
    const date = new Date(val);
    return !isNaN(date.getTime());
}, { message: 'Invalid date format. Use YYYY-MM-DD or ISO 8601 format' });

// ============ TRANSACTION SCHEMAS ============
const createTransactionSchema = z.object({
    type: z.enum(['income', 'expense', 'transfer'], {
        errorMap: () => ({ message: 'Type must be income, expense, or transfer' })
    }),
    amount: z.number().positive('Amount must be a positive number'),
    categoryId: z.string().length(24, 'Invalid category ID'),
    description: z.string().max(200, 'Description cannot exceed 200 characters').optional().default(''),
    date: dateString,
    division: z.enum(['personal', 'office'], {
        errorMap: () => ({ message: 'Division must be personal or office' })
    }),
    accountId: z.string().length(24, 'Invalid account ID').optional().nullable(),
    toAccountId: z.string().length(24, 'Invalid target account ID').optional().nullable()
});

const updateTransactionSchema = createTransactionSchema.partial();

// ============ CATEGORY SCHEMAS ============
const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(50, 'Name cannot exceed 50 characters'),
    emoji: z.string().min(1, 'Emoji is required').max(4, 'Invalid emoji'),
    type: z.enum(['income', 'expense'], {
        errorMap: () => ({ message: 'Type must be income or expense' })
    }),
    division: z.enum(['personal', 'office'], {
        errorMap: () => ({ message: 'Division must be personal or office' })
    })
});

const updateCategorySchema = createCategorySchema.partial();

// ============ BUDGET SCHEMAS ============
const createBudgetSchema = z.object({
    categoryId: z.string().length(24, 'Invalid category ID'),
    amount: z.number().positive('Budget amount must be positive'),
    period: z.enum(['monthly', 'weekly']).default('monthly')
});

const updateBudgetSchema = z.object({
    amount: z.number().positive('Budget amount must be positive').optional(),
    period: z.enum(['monthly', 'weekly']).optional()
});

// ============ ACCOUNT SCHEMAS ============
const createAccountSchema = z.object({
    name: z.string().min(1, 'Account name is required').max(50, 'Name cannot exceed 50 characters'),
    type: z.enum(['bank', 'cash', 'wallet'], {
        errorMap: () => ({ message: 'Type must be bank, cash, or wallet' })
    }),
    balance: z.number().default(0)
});

const updateAccountSchema = createAccountSchema.partial();

const transferSchema = z.object({
    fromAccountId: z.string().length(24, 'Invalid source account ID'),
    toAccountId: z.string().length(24, 'Invalid destination account ID'),
    amount: z.number().positive('Transfer amount must be positive'),
    description: z.string().max(200).optional().default(''),
    date: dateString
});

// ============ GOAL SCHEMAS ============
const createGoalSchema = z.object({
    name: z.string().min(1, 'Goal name is required').max(100, 'Name cannot exceed 100 characters'),
    targetAmount: z.number().positive('Target amount must be positive'),
    currentAmount: z.number().min(0).default(0),
    targetDate: dateString
});

const updateGoalSchema = createGoalSchema.partial();

// ============ PROFILE SCHEMAS ============
const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD'];

const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
    currency: z.enum(SUPPORTED_CURRENCIES, {
        errorMap: () => ({ message: 'Invalid currency code' })
    }).optional(),
    defaultDivision: z.enum(['personal', 'office'], {
        errorMap: () => ({ message: 'Division must be personal or office' })
    }).optional()
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

const changeEmailSchema = z.object({
    newEmail: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required to change email')
});

module.exports = {
    registerSchema,
    loginSchema,
    createTransactionSchema,
    updateTransactionSchema,
    createCategorySchema,
    updateCategorySchema,
    createBudgetSchema,
    updateBudgetSchema,
    createAccountSchema,
    updateAccountSchema,
    transferSchema,
    createGoalSchema,
    updateGoalSchema,
    updateProfileSchema,
    changePasswordSchema,
    changeEmailSchema,
    SUPPORTED_CURRENCIES
};
