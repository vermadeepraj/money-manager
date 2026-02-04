import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees (₹1,23,456)
 * Uses Indian numbering system (lakhs, crores)
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format currency with decimals
 */
export function formatCurrencyDecimal(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date, format = 'short') {
    const d = new Date(date);

    if (format === 'short') {
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    }

    if (format === 'full') {
        return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }

    if (format === 'time') {
        return d.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    }

    return d.toLocaleDateString('en-IN');
}

/**
 * Format relative time (Today, Yesterday, etc.)
 */
export function formatRelativeDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return `Today, ${formatDate(d, 'time')}`;
    }

    if (diffDays === 1) {
        return `Yesterday, ${formatDate(d, 'time')}`;
    }

    if (diffDays < 7) {
        return d.toLocaleDateString('en-IN', {
            weekday: 'long',
        });
    }

    return formatDate(d, 'short');
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if transaction can be modified (within 12-hour window)
 */
export function canModifyTransaction(createdAt) {
    const hoursElapsed = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hoursElapsed < 12;
}

/**
 * Get greeting based on time of day
 */
export function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}
