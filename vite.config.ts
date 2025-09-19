import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'
import { reactRouter } from "@react-router/dev/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["mistral-ai-game-jam-description-improv.hf.space", "think-in-sync.com"],
  },
  plugins: [
    reactRouter(),
    VitePWA({
      registerType: 'autoUpdate',
      // We register SW via the React hook
      injectRegister: null,
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'og-image.webp', 'think-in-sync.webp'],
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
          { src: '/think-in-sync.webp', sizes: 'any', type: 'image/webp', purpose: 'any' },
          { src: '/think-in-sync.webp', sizes: 'any', type: 'image/webp', purpose: 'maskable' }
        ],
        screenshots: [
          { src: '/desktop.webp', type: 'image/webp', form_factor: 'wide', label: 'Gameplay on desktop', width: 2384, height: 1988 },
          { src: '/mobile.webp', type: 'image/webp', form_factor: 'narrow', label: 'Gameplay on mobile', width: 1176, height: 1988 }
        ],
        categories: ['games', 'puzzle'],
        prefer_related_applications: false,
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
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
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
