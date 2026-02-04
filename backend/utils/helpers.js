/**
 * Utility helper functions
 */

/**
 * Check if a transaction can be modified (within 12-hour window)
 * @param {Date} createdAt - Transaction creation timestamp
 * @returns {boolean} - True if transaction can be modified
 */
const canModifyTransaction = (createdAt) => {
    const hoursElapsed = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hoursElapsed < 12;
};

/**
 * Get start and end dates for a period
 * @param {string} period - 'week', 'month', or 'year'
 * @returns {{ startDate: Date, endDate: Date }}
 */
const getPeriodDates = (period) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
        case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;

        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;

        default:
            // Default to current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
};

/**
 * Get previous period dates for comparison
 * @param {string} period - 'week', 'month', or 'year'
 * @returns {{ startDate: Date, endDate: Date }}
 */
const getPreviousPeriodDates = (period) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
        case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay() - 7);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;

        case 'year':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;

        default:
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
};

/**
 * Format amount for Indian numbering system
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted amount with ₹ symbol
 */
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
};

module.exports = {
    canModifyTransaction,
    getPeriodDates,
    getPreviousPeriodDates,
    formatINR
};
