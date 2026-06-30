import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/suggest/google': {
          target: 'https://suggestqueries.google.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/suggest\/google/, '/complete/search'),
        },
        '/api/suggest/youtube': {
          target: 'https://suggestqueries.google.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/suggest\/youtube/, '/complete/search'),
        },
        '/api/suggest/duckduckgo': {
          target: 'https://duckduckgo.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/suggest\/duckduckgo/, '/ac'),
        },
      },
    },
  };
});
