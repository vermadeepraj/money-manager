import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
    persist(
        (set, get) => ({
            // Theme
            theme: 'dark',

            // Sidebar
            sidebarOpen: true,
            sidebarCollapsed: false,

            // Modals
            activeModal: null,
            modalData: null,

            // Global filters
            activePeriod: 'month', // 'week' | 'month' | 'year'
            activeDivision: 'personal', // 'personal' | 'office'

            // Loading states
            globalLoading: false,

            // Actions
            toggleTheme: () => {
                const newTheme = get().theme === 'dark' ? 'light' : 'dark';
                set({ theme: newTheme });
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
            },

            setTheme: (theme) => {
                set({ theme });
                document.documentElement.classList.toggle('dark', theme === 'dark');
            },

            toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),

            toggleSidebarCollapse: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

            openModal: (name, data = null) => set({ activeModal: name, modalData: data }),
            closeModal: () => set({ activeModal: null, modalData: null }),

            setPeriod: (period) => set({ activePeriod: period }),
            setDivision: (division) => set({ activeDivision: division }),

            setGlobalLoading: (loading) => set({ globalLoading: loading }),

            // Initialize theme on app load
            initTheme: () => {
                const { theme } = get();
                document.documentElement.classList.toggle('dark', theme === 'dark');
            },
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({
                theme: state.theme,
                sidebarCollapsed: state.sidebarCollapsed,
                activePeriod: state.activePeriod,
                activeDivision: state.activeDivision,
            }),
        }
    )
);
