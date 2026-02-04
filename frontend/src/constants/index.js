/**
 * Application-wide constants
 * Centralizes magic strings to prevent typos and ease refactoring
 */

// ============================================
// Division Types
// ============================================
export const DIVISIONS = {
    PERSONAL: 'personal',
    OFFICE: 'office',
}

export const DIVISION_OPTIONS = [
    { value: DIVISIONS.PERSONAL, label: 'Personal' },
    { value: DIVISIONS.OFFICE, label: 'Office' },
]

// ============================================
// Transaction Types
// ============================================
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
    TRANSFER: 'transfer',
}

export const TRANSACTION_TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    { value: TRANSACTION_TYPES.INCOME, label: 'Income' },
    { value: TRANSACTION_TYPES.EXPENSE, label: 'Expense' },
]

// ============================================
// Account Types
// ============================================
export const ACCOUNT_TYPES = {
    BANK: 'bank',
    CASH: 'cash',
    WALLET: 'wallet',
}

export const ACCOUNT_TYPE_OPTIONS = [
    { value: ACCOUNT_TYPES.BANK, label: 'Bank' },
    { value: ACCOUNT_TYPES.CASH, label: 'Cash' },
    { value: ACCOUNT_TYPES.WALLET, label: 'Wallet' },
]

// ============================================
// Category Types (matches transaction types)
// ============================================
export const CATEGORY_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
}

export const CATEGORY_TYPE_OPTIONS = [
    { value: CATEGORY_TYPES.INCOME, label: 'Income' },
    { value: CATEGORY_TYPES.EXPENSE, label: 'Expense' },
]

// ============================================
// Period/Time Range Options
// ============================================
export const PERIODS = {
    TODAY: 'today',
    WEEK: 'week',
    MONTH: 'month',
    QUARTER: 'quarter',
    YEAR: 'year',
    ALL: 'all',
}

export const PERIOD_OPTIONS = [
    { value: PERIODS.TODAY, label: 'Today' },
    { value: PERIODS.WEEK, label: 'This Week' },
    { value: PERIODS.MONTH, label: 'This Month' },
    { value: PERIODS.QUARTER, label: 'This Quarter' },
    { value: PERIODS.YEAR, label: 'This Year' },
    { value: PERIODS.ALL, label: 'All Time' },
]

// ============================================
// Budget Periods
// ============================================
export const BUDGET_PERIODS = {
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
}

export const BUDGET_PERIOD_OPTIONS = [
    { value: BUDGET_PERIODS.WEEKLY, label: 'Weekly' },
    { value: BUDGET_PERIODS.MONTHLY, label: 'Monthly' },
    { value: BUDGET_PERIODS.YEARLY, label: 'Yearly' },
]

// ============================================
// Modal Names (for uiStore.activeModal)
// ============================================
export const MODALS = {
    ADD_TRANSACTION: 'addTransaction',
    EDIT_TRANSACTION: 'editTransaction',
    ADD_CATEGORY: 'addCategory',
    EDIT_CATEGORY: 'editCategory',
    ADD_ACCOUNT: 'addAccount',
    EDIT_ACCOUNT: 'editAccount',
    ADD_BUDGET: 'addBudget',
    EDIT_BUDGET: 'editBudget',
    ADD_GOAL: 'addGoal',
    EDIT_GOAL: 'editGoal',
    CONFIRM_DELETE: 'confirmDelete',
    PROFILE: 'profile',
    CHANGE_PASSWORD: 'changePassword',
    CHANGE_EMAIL: 'changeEmail',
}

// ============================================
// API Configuration
// ============================================
export const API_CONFIG = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    DEBOUNCE_MS: 500,
}

// ============================================
// Business Rules
// ============================================
export const BUSINESS_RULES = {
    EDIT_WINDOW_HOURS: 12,
    UNDO_WINDOW_SECONDS: 30,
}

// ============================================
// Currency Configuration
// ============================================
export const CURRENCIES = {
    INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
    JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
    AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
    CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
    CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
    SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
}

export const CURRENCY_OPTIONS = Object.values(CURRENCIES).map(c => ({
    value: c.code,
    label: `${c.symbol} ${c.code} - ${c.name}`,
}))

// Default currency (for backwards compatibility)
export const CURRENCY = {
    SYMBOL: '₹', // ₹
    CODE: 'INR',
    LOCALE: 'en-IN',
}

// ============================================
// Date Format Configuration
// ============================================
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
    API: 'yyyy-MM-dd',
}

// ============================================
// Chart Colors (matches Tailwind theme)
// ============================================
export const CHART_COLORS = {
    INCOME: '#10b981', // emerald-500
    EXPENSE: '#f43f5e', // rose-500
    BALANCE: '#8b5cf6', // violet-500
    PRIMARY: '#6366f1', // indigo-500
    SECONDARY: '#64748b', // slate-500
    
    // Category colors for pie/donut charts
    PALETTE: [
        '#6366f1', // indigo-500
        '#8b5cf6', // violet-500
        '#a855f7', // purple-500
        '#d946ef', // fuchsia-500
        '#ec4899', // pink-500
        '#f43f5e', // rose-500
        '#f97316', // orange-500
        '#eab308', // yellow-500
        '#22c55e', // green-500
        '#14b8a6', // teal-500
        '#06b6d4', // cyan-500
        '#3b82f6', // blue-500
    ],
}
