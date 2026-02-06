import { create } from 'zustand';
import { transactionsAPI } from '../lib/api';
import {
    startOfWeek, endOfWeek, eachDayOfInterval,
    startOfMonth, endOfMonth,
    startOfYear, endOfYear,
    format
} from 'date-fns';

export const useTransactionStore = create((set, get) => ({
    // State
    transactions: [],
    isLoading: false,
    error: null,

    // Pagination
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    },

    // Filters
    filters: {
        search: '',
        type: 'all',
        categoryId: 'all',
        startDate: null,
        endDate: null,
    },

    // Summary data
    summary: {
        income: 0,
        expense: 0,
        balance: 0,
        count: 0,
    },
    trends: [],

    // Actions
    setFilters: (filters) => {
        set({
            filters: { ...get().filters, ...filters },
            pagination: { ...get().pagination, page: 1 } // Reset to page 1 on filter change
        });
    },

    resetFilters: () => {
        set({
            filters: {
                search: '',
                type: 'all',
                categoryId: 'all',
                startDate: null,
                endDate: null,
            },
            pagination: { ...get().pagination, page: 1 },
        });
    },

    setPage: (page) => {
        set({ pagination: { ...get().pagination, page } });
    },

    /**
     * Fetch transactions with current filters and pagination
     */
    fetchTransactions: async (period, division) => {
        set({ isLoading: true, error: null });
        const { filters, pagination } = get();

        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                period,
                division,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v && v !== 'all')
                ),
            };

            const response = await transactionsAPI.getAll(params);
            const { transactions, pagination: pag } = response.data.data;

            set({
                transactions,
                pagination: {
                    page: pag.page,
                    limit: pag.limit,
                    total: pag.total,
                    totalPages: pag.pages,
                },
                isLoading: false,
            });
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to fetch transactions';
            set({ isLoading: false, error: message });
        }
    },

    /**
     * Fetch more transactions (for mobile "Load More")
     */
    loadMore: async (period, division) => {
        const { pagination, transactions } = get();
        if (pagination.page >= pagination.totalPages) return;

        set({ isLoading: true });

        try {
            const params = {
                page: pagination.page + 1,
                limit: pagination.limit,
                period,
                division,
            };

            const response = await transactionsAPI.getAll(params);
            const { transactions: newTransactions, pagination: pag } = response.data.data;

            set({
                transactions: [...transactions, ...newTransactions],
                pagination: {
                    page: pag.page,
                    limit: pag.limit,
                    total: pag.total,
                    totalPages: pag.pages,
                },
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    /**
     * Fetch summary data
     */
    fetchSummary: async (period, division) => {
        try {
            const response = await transactionsAPI.getSummary({ period, division });
            set({ summary: response.data.data });
        } catch {
            // Silent fail for summary
        }
    },


    /**
     * Fetch trends data with gap filling
     */
    fetchTrends: async (period) => {
        try {
            const response = await transactionsAPI.getTrends({ period });
            const rawTrends = response.data.data.trend || [];

            // Generate full date range based on period
            const now = new Date();
            let start, end;

            switch (period) {
                case 'week':
                    start = startOfWeek(now);
                    end = endOfWeek(now);
                    break;
                case 'month':
                    start = startOfMonth(now);
                    end = endOfMonth(now);
                    break;
                case 'year':
                    start = startOfYear(now);
                    end = endOfYear(now);
                    break;
                default:
                    start = startOfMonth(now);
                    end = endOfMonth(now);
            }

            const allDates = eachDayOfInterval({ start, end });

            // Fill gaps
            const filledTrends = allDates.map(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const found = rawTrends.find(t => t.date === dateStr);

                return found || {
                    date: dateStr,
                    income: 0,
                    expense: 0,
                    net: 0
                };
            });

            set({ trends: filledTrends });
        } catch {
            set({ trends: [] });
        }
    },

    /**
     * Create transaction
     */
    createTransaction: async (data) => {
        try {
            const response = await transactionsAPI.create(data);
            const newTransaction = response.data.data.transaction;
            set({ transactions: [newTransaction, ...get().transactions] });
            return { success: true, transaction: newTransaction };
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create transaction';
            return { success: false, error: message };
        }
    },

    /**
     * Update transaction
     */
    updateTransaction: async (id, data) => {
        try {
            const response = await transactionsAPI.update(id, data);
            const updated = response.data.data.transaction;
            set({
                transactions: get().transactions.map((t) =>
                    t._id === id ? updated : t
                ),
            });
            return { success: true, transaction: updated };
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to update transaction';
            return { success: false, error: message };
        }
    },

    /**
     * Delete transaction (optimistic)
     */
    deleteTransaction: async (id) => {
        // Optimistic removal
        const original = get().transactions;
        set({ transactions: original.filter((t) => t._id !== id) });

        try {
            await transactionsAPI.delete(id);
            return { success: true, originalTransactions: original };
        } catch (error) {
            // Rollback on error
            set({ transactions: original });
            const message = error.response?.data?.error?.message || 'Failed to delete transaction';
            return { success: false, error: message };
        }
    },

    /**
     * Restore transaction (undo delete)
     */
    restoreTransaction: async (id) => {
        try {
            const response = await transactionsAPI.restore(id);
            const restored = response.data.data.transaction;
            set({ transactions: [restored, ...get().transactions] });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to restore transaction';
            return { success: false, error: message };
        }
    },

    // Clear all transactions
    clearTransactions: () => {
        set({
            transactions: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        });
    },
}));
