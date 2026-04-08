import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Animation libraries
          'animation-vendor': ['framer-motion', 'lenis'],
          
          // UI utilities
          'ui-vendor': ['lucide-react', 'axios'],
          
          // Admin pages (separate chunk for admin features)
          'admin': [
            './src/pages/admin/dashboard/AdminDashboard.jsx',
            './src/pages/admin/adminMember/AdminMembers.jsx',
            './src/pages/admin/adminRoles/AdminUserRoles.jsx',
            './src/pages/admin/adminTraavelGuides/AdminTravelGuides.jsx',
            './src/pages/admin/adminTravelDeals/AdminTravelDeals.jsx',
            './src/pages/admin/adminSettings/AdminSettings.jsx',
            './src/pages/admin/adminGiveaways/AdminGiveaways.jsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 KB
  },
})
