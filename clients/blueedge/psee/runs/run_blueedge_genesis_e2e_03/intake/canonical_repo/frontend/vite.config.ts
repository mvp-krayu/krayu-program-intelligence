// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Vite Configuration (Production-Optimized)
// ══════════════════════════════════════════════════════════════

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/pages': path.resolve(__dirname, './pages'),
      '@/components': path.resolve(__dirname, './components'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/api': path.resolve(__dirname, './api'),
      '@/contexts': path.resolve(__dirname, './contexts'),
      '@/constants': path.resolve(__dirname, './constants'),
      '@/types': path.resolve(__dirname, './types'),
      '@/utils': path.resolve(__dirname, './utils'),
      '@/socket': path.resolve(__dirname, './socket'),
      '@/router': path.resolve(__dirname, './router'),
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:3000', ws: true },
    },
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
      },
    },

    // ── Chunk Splitting Strategy ─────────────────────────
    rollupOptions: {
      output: {
        // Manual chunk definitions for optimal caching
        manualChunks(id) {
          // React core — rarely changes
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // React Router
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          // Chart.js — large, used on many pages
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-charts';
          }
          // Leaflet map — large, used on overview + fleet pages
          if (id.includes('leaflet') || id.includes('react-leaflet')) {
            return 'vendor-maps';
          }
          // Socket.IO — real-time features
          if (id.includes('socket.io')) {
            return 'vendor-socket';
          }
          // Lucide icons
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          // date-fns
          if (id.includes('date-fns')) {
            return 'vendor-dates';
          }
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }

          // ── App code splitting by section ──────────────
          // Fleet operations pages
          if (id.includes('/pages/fleet/')) return 'pages-fleet';
          // Safety pages
          if (id.includes('/pages/safety/')) return 'pages-safety';
          // Asset pages
          if (id.includes('/pages/assets/')) return 'pages-assets';
          // Energy pages
          if (id.includes('/pages/energy/')) return 'pages-energy';
          // Intelligence pages
          if (id.includes('/pages/intelligence/')) return 'pages-intelligence';
          // People pages
          if (id.includes('/pages/people/')) return 'pages-people';
          // Platform pages
          if (id.includes('/pages/platform/')) return 'pages-platform';
        },

        // Asset file naming for long-term caching
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || 'chunk';
          return `assets/js/${name}-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return 'assets/fonts/[name]-[hash].[ext]';
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 500, // KB

    // CSS
    cssCodeSplit: true,
    cssMinify: true,

    // Report compressed sizes in build output
    reportCompressedSize: true,
  },

  // ── Performance Optimizations ──────────────────────────
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-router-dom',
      'chart.js', 'react-chartjs-2',
      'lucide-react',
    ],
    exclude: ['leaflet'],
  },

  // ── CSS ────────────────────────────────────────────────
  css: {
    devSourcemap: true,
  },
}));
