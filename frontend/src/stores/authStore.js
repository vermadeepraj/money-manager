import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../lib/api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            accessToken: null,
            isLoading: false,
            isInitialized: false,
            error: null,

            // Actions
            setUser: (user) => set({ user }),
            setAccessToken: (accessToken) => set({ accessToken }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            /**
             * Login user
             */
            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authAPI.login({ email, password });
                    const { user, token } = response.data.data;
                    set({
                        user,
                        accessToken: token,
                        isLoading: false,
                        isInitialized: true,
                        error: null
                    });
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.error?.message || 'Login failed';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            /**
             * Register user
             */
            register: async (name, email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authAPI.register({ name, email, password });
                    const { user, token } = response.data.data;
                    set({
                        user,
                        accessToken: token,
                        isLoading: false,
                        isInitialized: true,
                        error: null
                    });
                    return { success: true };
                } catch (error) {
                    const message = error.response?.data?.error?.message || 'Registration failed';
                    set({ isLoading: false, error: message });
                    return { success: false, error: message };
                }
            },

            /**
             * Logout user
             */
            logout: async () => {
                try {
                    await authAPI.logout();
                } catch {
                    // Ignore logout errors
                }
                set({
                    user: null,
                    accessToken: null,
                    error: null
                });
            },

            /**
             * Refresh access token
             */
            refreshToken: async () => {
                try {
                    const response = await authAPI.refresh();
                    const { accessToken, user } = response.data.data;
                    set({ accessToken, user });
                    return { success: true };
                } catch (error) {
                    set({ user: null, accessToken: null });
                    throw error;
                }
            },

            /**
             * Check authentication status on app init
             * Only tries refresh if there was previously a user session
             */
            checkAuth: async () => {
                const { accessToken, user } = get();

                // If we already have a token, we're good
                if (accessToken && user) {
                    set({ isInitialized: true });
                    return;
                }

                // If we have a user but no token, try to refresh
                // (This means the token expired but refresh cookie might still be valid)
                if (user && !accessToken) {
                    try {
                        await get().refreshToken();
                    } catch {
                        // Refresh failed, clear user
                        set({ user: null, accessToken: null });
                    }
                }

                // Mark as initialized regardless
                set({ isInitialized: true });
            },

            /**
             * Get current user from API
             */
            fetchUser: async () => {
                try {
                    const response = await authAPI.me();
                    set({ user: response.data.data.user });
                } catch {
                    // Token invalid, will be handled by interceptor
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                user: state.user
            }),
        }
    )
);
