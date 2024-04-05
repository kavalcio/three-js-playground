import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [react(), glsl()],
  server: {
    port: 3002,
  },
  resolve: {
    extensions: ['.mdx', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': '/src',
      src: '/src',
    },
  },
});
