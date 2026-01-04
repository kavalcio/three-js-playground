import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  publicDir: 'public',
  plugins: [react(), glsl(), viteTsconfigPaths()],
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
