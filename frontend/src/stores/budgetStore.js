import { create } from 'zustand'
import { budgetsAPI } from '../lib/api'

/**
 * Budget Store
 * Manages budget state and CRUD operations
 */
export const useBudgetStore = create((set, get) => ({
    // State
    budgets: [],
    currentBudget: null,
    isLoading: false,
    error: null,
    
    // Filters
    filters: {
        period: 'all',
        division: 'all',
    },

    // ============================================
    // Actions
    // ============================================

    /**
     * Fetch all budgets with optional filters
     */
    fetchBudgets: async () => {
        set({ isLoading: true, error: null })
        try {
            const { filters } = get()
            const params = {}
            
            if (filters.period && filters.period !== 'all') {
                params.period = filters.period
            }
            if (filters.division && filters.division !== 'all') {
                params.division = filters.division
            }

            const response = await budgetsAPI.getAll(params)
            set({ 
                budgets: response.data.data.budgets || [], 
                isLoading: false 
            })
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to fetch budgets'
            set({ isLoading: false, error: message })
        }
    },

    /**
     * Fetch a single budget by ID
     */
    fetchBudgetById: async (id) => {
        set({ isLoading: true, error: null })
        try {
            const response = await budgetsAPI.getById(id)
            set({ 
                currentBudget: response.data.data.budget, 
                isLoading: false 
            })
            return { success: true, data: response.data.data.budget }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to fetch budget'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Create a new budget
     */
    createBudget: async (data) => {
        set({ isLoading: true, error: null })
        try {
            const response = await budgetsAPI.create(data)
            const newBudget = response.data.data.budget
            set({ 
                budgets: [newBudget, ...get().budgets], 
                isLoading: false 
            })
            return { success: true, data: newBudget }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create budget'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Update an existing budget
     */
    updateBudget: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
            const response = await budgetsAPI.update(id, data)
            const updatedBudget = response.data.data.budget
            set({
                budgets: get().budgets.map(b => b._id === id ? updatedBudget : b),
                currentBudget: get().currentBudget?._id === id ? updatedBudget : get().currentBudget,
                isLoading: false
            })
            return { success: true, data: updatedBudget }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to update budget'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Delete a budget
     */
    deleteBudget: async (id) => {
        set({ isLoading: true, error: null })
        try {
            await budgetsAPI.delete(id)
            set({
                budgets: get().budgets.filter(b => b._id !== id),
                currentBudget: get().currentBudget?._id === id ? null : get().currentBudget,
                isLoading: false
            })
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to delete budget'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    // ============================================
    // Filter Actions
    // ============================================

    /**
     * Update filters and refetch budgets
     */
    setFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } })
        get().fetchBudgets()
    },

    /**
     * Reset filters to defaults
     */
    resetFilters: () => {
        set({ filters: { period: 'all', division: 'all' } })
        get().fetchBudgets()
    },

    // ============================================
    // Utility Actions
    // ============================================

    /**
     * Clear error state
     */
    clearError: () => set({ error: null }),

    /**
     * Clear current budget selection
     */
    clearCurrentBudget: () => set({ currentBudget: null }),

    /**
     * Get budget by ID from local state (without API call)
     */
    getBudgetById: (id) => {
        return get().budgets.find(b => b._id === id) || null
    },

    /**
     * Calculate budget utilization percentage
     */
    getBudgetUtilization: (budget) => {
        if (!budget || budget.amount <= 0) return 0
        const spent = budget.spent || 0
        return Math.min((spent / budget.amount) * 100, 100)
    },

    /**
     * Check if budget is over limit
     */
    isBudgetOverLimit: (budget) => {
        if (!budget) return false
        return (budget.spent || 0) > budget.amount
    },

    /**
     * Get budgets that are over or near limit (>80%)
     */
    getWarningBudgets: () => {
        return get().budgets.filter(budget => {
            const utilization = get().getBudgetUtilization(budget)
            return utilization >= 80
        })
    }
}))
