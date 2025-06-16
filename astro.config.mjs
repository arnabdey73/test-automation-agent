import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  // Enable server-side rendering for API routes
  output: 'server',
  // Add Node.js adapter for server-side rendering
  adapter: node({
    mode: 'standalone',
  }),
  // Set up server configuration
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
    host: true
  },
  // Production optimizations
  build: {
    format: 'file',
    assets: 'assets'
  },
  // Improved caching for production
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      assetsInlineLimit: 4096,
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
});
