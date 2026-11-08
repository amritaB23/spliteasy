import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite builds and serves the app; Vitest reuses the same config for unit tests.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split big libraries into their own files so the browser can cache them separately.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          charts: ['recharts'],
        },
      },
    },
  },
  test: {
    environment: 'node',
  },
});
