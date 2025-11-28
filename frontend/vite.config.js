import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'https://vedx-solutions-2-9ij5.vercel.app/',
        changeOrigin: true
      }
    }
  }
});
// http://localhost:5000