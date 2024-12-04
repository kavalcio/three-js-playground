import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [react(), glsl()],
  server: {
    port: 3002,
    open: true,
  },
  resolve: {
    extensions: ['.mdx', '.js', '.jsx', '.ts', '.tsx', '.glsl'],
    alias: {
      '@': '/src',
      src: '/src',
    },
  },
});
