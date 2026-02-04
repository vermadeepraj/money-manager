import { create } from 'zustand'
import { goalsAPI } from '../lib/api'

/**
 * Goal Store
 * Manages savings goals state and CRUD operations
 */
export const useGoalStore = create((set, get) => ({
    // State
    goals: [],
    currentGoal: null,
    isLoading: false,
    error: null,
    
    // Filters
    filters: {
        status: 'all', // all, active, completed
        division: 'all',
    },

    // ============================================
    // Actions
    // ============================================

    /**
     * Fetch all goals with optional filters
     */
    fetchGoals: async () => {
        set({ isLoading: true, error: null })
        try {
            const { filters } = get()
            const params = {}
            
            if (filters.status && filters.status !== 'all') {
                params.status = filters.status
            }
            if (filters.division && filters.division !== 'all') {
                params.division = filters.division
            }

            const response = await goalsAPI.getAll(params)
            set({ 
                goals: response.data.data.goals || [], 
                isLoading: false 
            })
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to fetch goals'
            set({ isLoading: false, error: message })
        }
    },

    /**
     * Fetch a single goal by ID
     */
    fetchGoalById: async (id) => {
        set({ isLoading: true, error: null })
        try {
            const response = await goalsAPI.getById(id)
            set({ 
                currentGoal: response.data.data.goal, 
                isLoading: false 
            })
            return { success: true, data: response.data.data.goal }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to fetch goal'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Create a new goal
     */
    createGoal: async (data) => {
        set({ isLoading: true, error: null })
        try {
            const response = await goalsAPI.create(data)
            const newGoal = response.data.data.goal
            set({ 
                goals: [newGoal, ...get().goals], 
                isLoading: false 
            })
            return { success: true, data: newGoal }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to create goal'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Update an existing goal
     */
    updateGoal: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
            const response = await goalsAPI.update(id, data)
            const updatedGoal = response.data.data.goal
            set({
                goals: get().goals.map(g => g._id === id ? updatedGoal : g),
                currentGoal: get().currentGoal?._id === id ? updatedGoal : get().currentGoal,
                isLoading: false
            })
            return { success: true, data: updatedGoal }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to update goal'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Delete a goal
     */
    deleteGoal: async (id) => {
        set({ isLoading: true, error: null })
        try {
            await goalsAPI.delete(id)
            set({
                goals: get().goals.filter(g => g._id !== id),
                currentGoal: get().currentGoal?._id === id ? null : get().currentGoal,
                isLoading: false
            })
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to delete goal'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Contribute to a goal (add to currentAmount)
     */
    contributeToGoal: async (id, amount) => {
        set({ isLoading: true, error: null })
        try {
            const response = await goalsAPI.contribute(id, { amount })
            const updatedGoal = response.data.data.goal
            set({
                goals: get().goals.map(g => g._id === id ? updatedGoal : g),
                currentGoal: get().currentGoal?._id === id ? updatedGoal : get().currentGoal,
                isLoading: false
            })
            return { success: true, data: updatedGoal }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to contribute to goal'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    // ============================================
    // Filter Actions
    // ============================================

    /**
     * Update filters and refetch goals
     */
    setFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } })
        get().fetchGoals()
    },

    /**
     * Reset filters to defaults
     */
    resetFilters: () => {
        set({ filters: { status: 'all', division: 'all' } })
        get().fetchGoals()
    },

    // ============================================
    // Utility Actions
    // ============================================

    /**
     * Clear error state
     */
    clearError: () => set({ error: null }),

    /**
     * Clear current goal selection
     */
    clearCurrentGoal: () => set({ currentGoal: null }),

    /**
     * Get goal by ID from local state (without API call)
     */
    getGoalById: (id) => {
        return get().goals.find(g => g._id === id) || null
    },

    /**
     * Calculate goal progress percentage
     */
    getGoalProgress: (goal) => {
        if (!goal || goal.targetAmount <= 0) return 0
        const current = goal.currentAmount || 0
        return Math.min((current / goal.targetAmount) * 100, 100)
    },

    /**
     * Check if goal is completed
     */
    isGoalCompleted: (goal) => {
        if (!goal) return false
        return (goal.currentAmount || 0) >= goal.targetAmount
    },

    /**
     * Calculate remaining amount to reach goal
     */
    getRemainingAmount: (goal) => {
        if (!goal) return 0
        const remaining = goal.targetAmount - (goal.currentAmount || 0)
        return Math.max(remaining, 0)
    },

    /**
     * Calculate days remaining until deadline
     */
    getDaysRemaining: (goal) => {
        if (!goal || !goal.targetDate) return null
        const now = new Date()
        const deadline = new Date(goal.targetDate)
        const diffTime = deadline - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    },

    /**
     * Check if goal is overdue (past deadline but not completed)
     */
    isGoalOverdue: (goal) => {
        if (!goal || !goal.targetDate) return false
        if (get().isGoalCompleted(goal)) return false
        const daysRemaining = get().getDaysRemaining(goal)
        return daysRemaining !== null && daysRemaining < 0
    },

    /**
     * Get active goals (not completed and not overdue)
     */
    getActiveGoals: () => {
        return get().goals.filter(goal => {
            return !get().isGoalCompleted(goal) && !get().isGoalOverdue(goal)
        })
    },

    /**
     * Get completed goals
     */
    getCompletedGoals: () => {
        return get().goals.filter(goal => get().isGoalCompleted(goal))
    },

    /**
     * Calculate suggested monthly contribution to reach goal by deadline
     */
    getSuggestedContribution: (goal) => {
        if (!goal || !goal.targetDate) return null
        const remaining = get().getRemainingAmount(goal)
        const daysRemaining = get().getDaysRemaining(goal)
        if (daysRemaining <= 0 || remaining <= 0) return null
        const monthsRemaining = daysRemaining / 30
        return Math.ceil(remaining / monthsRemaining)
    }
}))
