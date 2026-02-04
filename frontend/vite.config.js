import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // HeroUI components
          'heroui': ['@heroui/react'],
          // Animation libraries
          'animation': ['framer-motion', 'gsap'],
          // Charts
          'charts': ['recharts'],
          // Form handling
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Data tables
          'tables': ['@tanstack/react-table'],
          // State management
          'state': ['zustand', 'axios'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
