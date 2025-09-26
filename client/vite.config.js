/**
 * Vite Configuration for New Design React Frontend
 * 
 * This file configures the Vite build tool for the new design React application.
 * Uses different ports to avoid conflicts with the original design.
 * Optimized for fast development experience.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Plugins array - React plugin enables JSX and React features
  plugins: [react()],
  
  // Development server configuration - optimized for speed
  server: {
    port: 3004, // Different port to avoid conflicts
    host: true, // Allow external connections
    open: true, // Open browser on start
    hmr: {
      overlay: false, // Disable HMR overlay for faster updates
      port: 3004, // Ensure HMR uses the same port
    },
    watch: {
      usePolling: false, // Use native file watching for better performance
      interval: 100, // Faster polling interval
    },
    fs: {
      strict: false, // Allow serving files outside of root
    }
  },
  
  // Build configuration for production
  build: {
    target: 'es2015',
    outDir: 'dist', // Output directory for built files
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps for better performance
    minify: 'terser', // Minify code for smaller bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Core dependencies
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          
          // Feature-based chunks for better caching
          'brand-portal': [
            'src/features/brand-portal'
          ],
          'influencer-portal': [
            'src/features/influencer-portal'
          ],
          'auth': [
            'src/features/auth'
          ],
          'email-marketing': [
            'src/features/email-marketing'
          ],
          
          // Shared components chunk
          'shared': [
            'src/shared'
          ],
          
          // Landing page (separate for better initial load)
          'landing': [
            'src/features/landing'
          ]
        },
        // Optimize chunk names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Preview server for testing production build
  preview: {
    port: 4001, // Different port for preview
    host: true,
  },

  // Resolve configuration for better module resolution
  resolve: {
    alias: {
      '@': '/src',
      '@shared': '/src/shared',
      '@features': '/src/features'
    }
  },

  // Optimize dependencies for faster startup and HMR
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'axios'
    ],
    exclude: [], // Exclude any problematic dependencies
    force: false, // Only force re-optimization when needed
  },

  // CSS optimization
  css: {
    devSourcemap: false, // Disable CSS source maps for faster dev
    postcss: {
      // Minimal PostCSS config for faster processing
    }
  },

  // Additional performance optimizations
  esbuild: {
    target: 'esnext', // Use latest ES features for faster builds
    jsx: 'automatic', // Use automatic JSX runtime
  },

  // Cache configuration for faster rebuilds
  cacheDir: 'node_modules/.vite',
}) 