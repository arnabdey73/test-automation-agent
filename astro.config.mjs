import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
// import vercel from '@astrojs/vercel/serverless';

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
  // Use Node adapter for local production
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
      rollupOptions: {
        // Explicitly externalize modules to avoid build issues
        external: [
          'socket.io', 
          'playwright',
          'playwright-core',
          '@playwright/test'
        ]
      },
    },
    ssr: {
      // Add modules to noExternal to ensure they're processed properly
      noExternal: [
        'socket.io', 
        'socket.io-client', 
        'engine.io-client', 
        'engine.io'
      ]
    }
  },
});
