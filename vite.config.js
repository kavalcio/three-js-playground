import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [react()],
  server: {
    port: 3002,
  },
  resolve: {
    extensions: ['.mdx', '.js', '.jsx'],
    alias: {
      '@': '/src',
    },
  },
});
