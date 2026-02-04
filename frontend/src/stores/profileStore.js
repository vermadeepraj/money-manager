import { create } from 'zustand'
import { profileAPI } from '../lib/api'
import { useAuthStore } from './authStore'

export const useProfileStore = create((set, get) => ({
    // State
    profile: null,
    isLoading: false,
    isUploading: false,
    error: null,

    // Actions
    setProfile: (profile) => set({ profile }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    /**
     * Fetch user profile
     */
    fetchProfile: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await profileAPI.get()
            const profile = response.data.data.profile
            set({ profile, isLoading: false })
            
            // Also update the user in authStore to keep them in sync
            useAuthStore.getState().setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                profilePicture: profile.profilePicture,
                currency: profile.currency,
                defaultDivision: profile.defaultDivision,
            })
            
            return { success: true, profile }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to fetch profile'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Update user profile (name, currency, defaultDivision)
     */
    updateProfile: async (data) => {
        set({ isLoading: true, error: null })
        try {
            const response = await profileAPI.update(data)
            const profile = response.data.data.profile
            set({ profile, isLoading: false })
            
            // Update authStore user
            useAuthStore.getState().setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
                profilePicture: profile.profilePicture,
                currency: profile.currency,
                defaultDivision: profile.defaultDivision,
            })
            
            return { success: true, profile }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to update profile'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Upload profile photo
     */
    uploadPhoto: async (file) => {
        set({ isUploading: true, error: null })
        try {
            const response = await profileAPI.uploadPhoto(file)
            const { profilePicture } = response.data.data
            
            // Update local state
            set((state) => ({
                isUploading: false,
                profile: state.profile ? { ...state.profile, profilePicture } : null
            }))
            
            // Update authStore user
            const currentUser = useAuthStore.getState().user
            if (currentUser) {
                useAuthStore.getState().setUser({
                    ...currentUser,
                    profilePicture,
                })
            }
            
            return { success: true, profilePicture }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to upload photo'
            set({ isUploading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Delete profile photo
     */
    deletePhoto: async () => {
        set({ isUploading: true, error: null })
        try {
            await profileAPI.deletePhoto()
            
            // Update local state
            set((state) => ({
                isUploading: false,
                profile: state.profile ? { ...state.profile, profilePicture: null } : null
            }))
            
            // Update authStore user
            const currentUser = useAuthStore.getState().user
            if (currentUser) {
                useAuthStore.getState().setUser({
                    ...currentUser,
                    profilePicture: null,
                })
            }
            
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to delete photo'
            set({ isUploading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Change password
     */
    changePassword: async (currentPassword, newPassword, confirmPassword) => {
        set({ isLoading: true, error: null })
        try {
            await profileAPI.changePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            })
            set({ isLoading: false })
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to change password'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Request email change (sends verification to new email)
     */
    requestEmailChange: async (newEmail, password) => {
        set({ isLoading: true, error: null })
        try {
            const response = await profileAPI.requestEmailChange({ newEmail, password })
            set({ isLoading: false })
            return { 
                success: true, 
                ...response.data.data 
            }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to request email change'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Verify new email with token
     */
    verifyEmail: async (token) => {
        set({ isLoading: true, error: null })
        try {
            const response = await profileAPI.verifyEmail(token)
            const { email } = response.data.data
            
            // Update local profile
            set((state) => ({
                isLoading: false,
                profile: state.profile ? { ...state.profile, email, isEmailVerified: true } : null
            }))
            
            // Update authStore user
            const currentUser = useAuthStore.getState().user
            if (currentUser) {
                useAuthStore.getState().setUser({
                    ...currentUser,
                    email,
                })
            }
            
            return { success: true, email }
        } catch (error) {
            const message = error.response?.data?.error?.message || 'Failed to verify email'
            set({ isLoading: false, error: message })
            return { success: false, error: message }
        }
    },

    /**
     * Reset store state
     */
    reset: () => set({
        profile: null,
        isLoading: false,
        isUploading: false,
        error: null,
    }),
}))
