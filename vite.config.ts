import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
    allowedHosts: ['mini-app-client.local'],
    hmr: {
      host: 'mini-app-client.local',
      protocol: 'ws', // принудительно HTTP, а не wss
      port: 5173,
    },
  },
  optimizeDeps: {
    include: ['leaflet'],
  },
});
