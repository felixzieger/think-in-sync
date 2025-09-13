import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["mistral-ai-game-jam-description-improv.hf.space", "think-in-sync.com"],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We register SW via the React hook
      injectRegister: null,
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'og-image.png', 'think-in-sync.png'],
      manifest: {
        id: '/',
        name: 'Think in Sync',
        short_name: 'ThinkInSync',
        description: 'A word puzzle game.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0ea5e9',
        theme_color: '#0ea5e9',
        icons: [
          { src: '/think-in-sync.png', sizes: 'any', type: 'image/png', purpose: 'any' },
          { src: '/think-in-sync.png', sizes: 'any', type: 'image/png', purpose: 'maskable' }
        ],
        screenshots: [
          { src: '/desktop.png', type: 'image/png', form_factor: 'wide', label: 'Gameplay on desktop', width: 2384, height: 1988 },
          { src: '/mobile.png', type: 'image/png', form_factor: 'narrow', label: 'Gameplay on mobile', width: 1176, height: 1988 }
        ],
        categories: ['games', 'puzzle'],
        prefer_related_applications: false,
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // Cache same‑origin images with SWR
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            // Cache Google Fonts (if used)
            urlPattern: /https:\/\/(fonts\.gstatic\.com|fonts\.googleapis\.com)\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 24 * 60 * 60 },
            },
          },
        ],
      },
    })
  ],
  build: {
    sourcemap: true,
    // Keep the warning helpful but less noisy if slightly over
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          // Group large libs into their own async chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
          'tanstack': ['@tanstack/react-query']
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
