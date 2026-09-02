import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // OWNER: Member 5. This is what makes the airplane-mode demo work.
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mwalimu wa Grade 10',
        short_name: 'Mwalimu',
        description: 'Night-before teaching packs for Grade 10 strands. Works offline.',
        theme_color: '#1f4e3d',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [],
      },
      workbox: {
        // App shell is precached. Pack DATA lives in IndexedDB, not here —
        // do not try to cache POST /api/packs, it will not work.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': { target: process.env.VITE_API_URL ?? 'http://localhost:4000', changeOrigin: true },
    },
  },
});
