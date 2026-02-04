import { create } from 'zustand';
import { categoriesAPI } from '../lib/api';

export const useCategoryStore = create((set, get) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await categoriesAPI.getAll();
            set({ categories: response.data.data.categories, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: 'Failed to fetch categories' });
        }
    },

    createCategory: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await categoriesAPI.create(data);
            const newCategory = response.data.data.category;
            set({ categories: [...get().categories, newCategory], isLoading: false });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create category';
            set({ isLoading: false, error: message });
            return { success: false, error: message };
        }
    },

    updateCategory: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await categoriesAPI.update(id, data);
            const updatedCategory = response.data.data.category;
            set({
                categories: get().categories.map(c => c._id === id ? updatedCategory : c),
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false, error: 'Failed to update category' });
            return { success: false, error: 'Failed to update category' };
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await categoriesAPI.delete(id);
            set({
                categories: get().categories.filter(c => c._id !== id),
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            set({ isLoading: false, error: 'Failed to delete category' });
            return { success: false, error: 'Failed to delete category' };
        }
    }
}));
