import { create } from 'zustand';
import { accountsAPI } from '../lib/api';

export const useAccountStore = create((set, get) => ({
    accounts: [],
    isLoading: false,
    error: null,

    fetchAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await accountsAPI.getAll();
            set({ accounts: response.data.data.accounts, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: 'Failed to fetch accounts' });
        }
    },

    createAccount: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await accountsAPI.create(data);
            const newAccount = response.data.data.account;
            set({ accounts: [newAccount, ...get().accounts], isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create account';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    updateAccount: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await accountsAPI.update(id, data);
            const updatedAccount = response.data.data.account;
            set({
                accounts: get().accounts.map(a => a._id === id ? updatedAccount : a),
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false, error: 'Failed to update account' });
            return { success: false, error: 'Failed to update account' };
        }
    },

    deleteAccount: async (id) => {
        set({ isLoading: true, error: null });
        try {
            // Check if account has transactions? Usually handled by backend or allowed with warning.
            // Backend schema has isDeleted, so it's a soft delete.
            await accountsAPI.delete(id);
            set({
                accounts: get().accounts.filter(a => a._id !== id),
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false, error: 'Failed to delete account' });
            return { success: false, error: 'Failed to delete account' };
        }
    }
}));
