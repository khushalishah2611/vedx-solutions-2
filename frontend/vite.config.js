import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { API_BASE } from "../../utils/const"; 
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: API_BASE,
        changeOrigin: true
      }
    }
  }
});
