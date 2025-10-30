import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  base: './',  // 添加这一行以支持 GitHub Pages
  build: {
    outDir: 'dist'
  }
});